/**
 * PostgresV3 enables interacting with a Postgres database using Spin's v3 interface.
 * To use this module you  need to add `spin3-imports` to your `knitwit.json` file and run
 * `npx knitwit`.
 *
 * @module PostgresV3
 */
//@ts-ignore
import * as spinPg from 'spin:postgres/postgres@3.0.0';
export var PostgresV3DataType;
(function (PostgresV3DataType) {
    PostgresV3DataType["PostgresV3Boolean"] = "boolean";
    PostgresV3DataType["PostgresV3Int8"] = "int8";
    PostgresV3DataType["PostgresV3Int16"] = "int16";
    PostgresV3DataType["PostgresV3Int32"] = "int32";
    PostgresV3DataType["PostgresV3Int64"] = "int64";
    PostgresV3DataType["PostgresV3Floating32"] = "floating32";
    PostgresV3DataType["PostgresV3Floating64"] = "floating64";
    PostgresV3DataType["PostgresV3Str"] = "str";
    PostgresV3DataType["PostgresV3Binary"] = "binary";
    PostgresV3DataType["PostgresV3Date"] = "date";
    PostgresV3DataType["PostgresV3Time"] = "time";
    PostgresV3DataType["PostgresV3DateTime"] = "datetime";
    PostgresV3DataType["PostgresV3TimeStamp"] = "timestamp";
    PostgresV3DataType["PostgresV3Other"] = "other";
})(PostgresV3DataType || (PostgresV3DataType = {}));
function createPostgresConnection(connection) {
    return {
        query: (statement, params) => {
            let santizedParams = convertRdbmsToWitTypes(params);
            let ret = connection.query(statement, santizedParams);
            let results = {
                columns: ret.columns,
                rows: [],
            };
            ret.rows.map((k, rowIndex) => {
                results.rows.push({});
                k.map((val, valIndex) => {
                    switch (val.tag) {
                        case 'date': {
                            // Date (year, month, day)
                            const [year, month, day] = val.val;
                            results.rows[rowIndex][results.columns[valIndex].name] = new Date(Date.UTC(year, month - 1, day)); // UTC Date object
                            break;
                        }
                        case 'time': {
                            // Time (hour, minute, second, nanosecond)
                            const [hour, minute, second, nanosecond] = val.val;
                            const date = new Date(Date.UTC(1970, 0, 1, hour, minute, second)); // Using an arbitrary date
                            date.setMilliseconds(nanosecond / 1000000); // Convert nanoseconds to milliseconds
                            results.rows[rowIndex][results.columns[valIndex].name] = date; // UTC Date object with only time set
                            break;
                        }
                        case 'datetime': {
                            // DateTime (year, month, day, hour, minute, second, nanosecond)
                            const [year, month, day, hour, minute, second, nanosecond] = val.val;
                            const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
                            date.setMilliseconds(nanosecond / 1000000); // Convert nanoseconds to milliseconds
                            results.rows[rowIndex][results.columns[valIndex].name] = date; // Complete UTC Date object
                            break;
                        }
                        case 'timestamp': {
                            // Timestamp (seconds since epoch)
                            const seconds = val.val;
                            results.rows[rowIndex][results.columns[valIndex].name] = new Date(seconds * 1000); // Convert seconds to milliseconds
                            break;
                        }
                        default: {
                            results.rows[rowIndex][results.columns[valIndex].name] =
                                val.tag == 'db-null' || val.tag == 'unsupported'
                                    ? null
                                    : val.val;
                            break;
                        }
                    }
                });
            });
            return results;
        },
        execute: (statement, params) => {
            let santizedParams = convertRdbmsToWitTypes(params);
            let ret = connection.execute(statement, santizedParams);
            return ret;
        },
    };
}
/**
 * Opens a PostgreSQL connection to the specified address.
 * @param {string} address - The address of the PostgreSQL server.
 * @returns {PostgresConnection} The PostgreSQL connection object.
 */
export function open(address) {
    return createPostgresConnection(spinPg.Connection.open(address));
}
function convertRdbmsToWitTypes(parameters) {
    let sanitized = [];
    for (let k of parameters) {
        if (typeof k === 'object') {
            sanitized.push(k);
            continue;
        }
        if (typeof k === 'string') {
            sanitized.push({ tag: 'str', val: k });
            continue;
        }
        if (typeof k === null) {
            sanitized.push({ tag: 'db-null' });
            continue;
        }
        if (typeof k === 'boolean') {
            sanitized.push({ tag: 'boolean', val: k });
            continue;
        }
        if (typeof k === 'bigint') {
            sanitized.push({ tag: 'int64', val: k });
            continue;
        }
        if (typeof k === 'number') {
            isFloat(k)
                ? sanitized.push({ tag: 'floating64', val: k })
                : sanitized.push({ tag: 'int32', val: k });
            continue;
        }
        if (k instanceof Uint8Array) {
            sanitized.push({ tag: 'binary', val: k });
            continue;
        }
    }
    return sanitized;
}
function isFloat(number) {
    return number % 1 !== 0;
}
