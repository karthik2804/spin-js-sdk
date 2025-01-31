/**
 * Enum representing the available models for inferencing.
 * @enum {string}
 */
export declare enum InferencingModels {
    Llama2Chat = "llama2-chat",
    CodellamaInstruct = "codellama-instruct"
}
/**
 * Enum representing the available models for generating embeddings.
 * @enum {string}
 */
export declare enum EmbeddingModels {
    AllMiniLmL6V2 = "all-minilm-l6-v2"
}
/**
 * Interface representing options for inferencing.
 * @interface InferencingOptions
 */
export interface InferencingOptions {
    maxTokens?: number;
    repeatPenalty?: number;
    repeatPenaltyLastNTokenCount?: number;
    temperature?: number;
    topK?: number;
    topP?: number;
}
/**
 * Interface representing internal options for inferencing.
 * @interface InternalInferencingOptions
 */
export interface InternalInferencingOptions {
    maxTokens?: number;
    repeatPenalty?: number;
    repeatPenaltyLastNTokenCount?: number;
    temperature?: number;
    topK?: number;
    topP?: number;
}
/**
 * Interface representing usage statistics for inferencing.
 * @interface InferenceUsage
 */
export interface InferenceUsage {
    promptTokenCount: number;
    generatedTokenCount: number;
}
/**
 * Interface representing the result of an inference.
 * @interface InferenceResult
 */
export interface InferenceResult {
    text: string;
    usage: InferenceUsage;
}
/**
 * Interface representing usage statistics for generating embeddings.
 * @interface EmbeddingUsage
 */
export interface EmbeddingUsage {
    promptTokenCount: number;
}
/**
 * Interface representing the result of generating embeddings.
 * @interface EmbeddingResult
 */
export interface EmbeddingResult {
    embeddings: Array<Array<number>>;
    usage: EmbeddingUsage;
}
/**
 * Performs inferencing using the specified model and prompt, with optional settings.
 * @param {InferencingModels | string} model - The model to use for inferencing.
 * @param {string} prompt - The prompt to use for inferencing.
 * @param {InferencingOptions} [options] - Optional settings for inferencing.
 * @returns {InferenceResult} The result of the inference.
 */
export declare function infer(model: InferencingModels | string, prompt: string, options?: InferencingOptions): InferenceResult;
/**
 * Generates embeddings for the given text using the specified model.
 * @param {EmbeddingModels | string} model - The model to use for generating embeddings.
 * @param {Array<string>} text - The text to generate embeddings for.
 * @returns {EmbeddingResult} The result of generating embeddings.
 */
export declare const generateEmbeddings: (model: EmbeddingModels | string, text: Array<string>) => EmbeddingResult;
