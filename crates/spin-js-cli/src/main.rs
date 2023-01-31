#![deny(warnings)]

#[cfg(not(target_os = "windows"))]
use binaryen::{CodegenConfig, Module};
use semver::Version;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use {
    anyhow::{bail, Context, Result},
    dirs,
    semver::VersionReq,
    serde_json,
    std::{
        env,
        fs::{self, File},
        path::PathBuf,
        process::Command,
        time::{SystemTime, UNIX_EPOCH},
    },
    structopt::StructOpt,
    wizer::Wizer,
};

#[derive(Debug, StructOpt)]
#[structopt(
    name = "js2wasm",
    about = "A spin plugin to convert javascript files to Spin compatible modules"
)]
pub struct Options {
    #[structopt(parse(from_os_str))]
    pub input: PathBuf,

    #[structopt(short = "o", parse(from_os_str), default_value = "index.wasm")]
    pub output: PathBuf,
}

const LATEST_MANIFEST_URL: &str =
    "https://raw.githubusercontent.com/fermyon/spin-plugins/main/manifests/js2wasm/js2wasm.json";
const CURRENT_VERSION: &str = env!("CARGO_PKG_VERSION");
const SECONDS_PER_DAY: u64 = 60 * 60 * 24;
const PLUGIN_DATA_FILE_PATH: &str = "spin-js2wasm/.js2wasm";

#[tokio::main]
async fn main() -> Result<()> {
    let opts = Options::from_args();

    if env::var("SPIN_JS_WIZEN").eq(&Ok("1".into())) {
        env::remove_var("SPIN_JS_WIZEN");

        println!("\nStarting to build Spin compatible module");

        let wasm: &[u8] = include_bytes!(concat!(env!("OUT_DIR"), "/engine.wasm"));

        // using binaryen on windows causes spinjs to silently generate malformed wasm
        #[cfg(target_os = "windows")]
        {
            let wasm = Wizer::new()
                .allow_wasi(true)?
                .inherit_stdio(true)
                .wasm_bulk_memory(true)
                .run(wasm)?;
            fs::write(&opts.output, wasm)?;
        }
        #[cfg(not(target_os = "windows"))]
        {
            println!("Preinitiating using Wizer");

            let mut wasm = Wizer::new()
                .allow_wasi(true)?
                .inherit_stdio(true)
                .wasm_bulk_memory(true)
                .run(wasm)?;

            let codegen_cfg = CodegenConfig {
                optimization_level: 3,
                shrink_level: 0,
                debug_info: false,
            };

            println!("Optimizing wasm binary using wasm-opt");

            if let Ok(mut module) = Module::read(&wasm) {
                module.optimize(&codegen_cfg);
                module
                    .run_optimization_passes(vec!["strip"], &codegen_cfg)
                    .unwrap();
                wasm = module.write();
            } else {
                bail!("Unable to read wasm binary for wasm-opt optimizations");
            }

            fs::write(&opts.output, wasm)?;
        }

        return Ok(());
    }

    let script = File::open(&opts.input)
        .with_context(|| format!("Failed to open input file {}", opts.input.display()))?;

    let self_cmd = env::args().next().unwrap();

    env::set_var("SPIN_JS_WIZEN", "1");
    let status = Command::new(self_cmd)
        .arg(&opts.input)
        .arg("-o")
        .arg(&opts.output)
        .stdin(script)
        .status()?;

    if !status.success() {
        bail!("Couldn't create wasm from input");
    }

    println!("Spin compatible module built successfully");

    let _ = check_for_updates().await;

    Ok(())
}

#[derive(Serialize, Deserialize)]
struct DataFILE {
    data_version: u16,
    last_check: u64,
}

async fn check_for_updates() -> Result<()> {
    let local_data_dir = dirs::data_local_dir();
    let plugin_data_file: PathBuf;
    let perform_check: bool;

    // If there is no local data storage location, don't do update checks
    if let Some(dir) = &local_data_dir {
        plugin_data_file = dir.join(PLUGIN_DATA_FILE_PATH);
    } else {
        return Ok(());
    }

    match plugin_data_file.exists() {
        true => {
            let contents = fs::read_to_string(&plugin_data_file)?;
            let data: DataFILE = serde_json::from_str(&contents)?;

            let current_time = (SystemTime::now().duration_since(UNIX_EPOCH)?).as_secs();
            perform_check = if current_time - data.last_check > SECONDS_PER_DAY {
                true
            } else {
                false
            };
        }
        _ => {
            perform_check = true;
        }
    }

    if perform_check {
        let version_requirement = VersionReq::parse(&format!(">{}", CURRENT_VERSION))?;
        let response = reqwest::get(LATEST_MANIFEST_URL).await?.text().await?;
        let manifest: Value = serde_json::from_str(&response)?;
        let manifest_version = match manifest["version"].as_str() {
            Some(ver) => Version::parse(ver)?,
            _ => Version::parse("0.0.0")?
        };

        if version_requirement.matches(&manifest_version) {
            print_version_alert(manifest_version.to_string());
        }

        let data = DataFILE {
            data_version: 1,
            last_check: (SystemTime::now().duration_since(UNIX_EPOCH)?).as_secs()
        };
        let data_dir_path = &local_data_dir.unwrap().join("spin-js2wasm");
        fs::create_dir_all(data_dir_path)?;
        std::fs::write(
            &plugin_data_file,
            serde_json::to_string_pretty(&data).unwrap(),
        ).unwrap();
    }

    Ok(())
}

fn print_version_alert(version: String) {
    println!("\x1b[32m*****************************************************\x1b[0m");
    println!("\x1b[32m New version of js2wasm - {} is available!\x1b[0m", version);
    println!("\x1b[32m Run the following commands to get it\x1b[0m");
    println!("\x1b[32m $ spin plugins update\x1b[0m");
    println!("\x1b[32m $ spin plugins upgrade js2wasm\x1b[0m");
    println!("\x1b[32m*****************************************************\x1b[0m");
}