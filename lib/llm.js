import { infer as llmInfer, generateEmbeddings as llmGenerateEmbeddings,
//@ts-ignore
 } from 'fermyon:spin/llm@2.0.0';
/**
 * Enum representing the available models for inferencing.
 * @enum {string}
 */
export var InferencingModels;
(function (InferencingModels) {
    InferencingModels["Llama2Chat"] = "llama2-chat";
    InferencingModels["CodellamaInstruct"] = "codellama-instruct";
})(InferencingModels || (InferencingModels = {}));
/**
 * Enum representing the available models for generating embeddings.
 * @enum {string}
 */
export var EmbeddingModels;
(function (EmbeddingModels) {
    EmbeddingModels["AllMiniLmL6V2"] = "all-minilm-l6-v2";
})(EmbeddingModels || (EmbeddingModels = {}));
/**
 * Performs inferencing using the specified model and prompt, with optional settings.
 * @param {InferencingModels | string} model - The model to use for inferencing.
 * @param {string} prompt - The prompt to use for inferencing.
 * @param {InferencingOptions} [options] - Optional settings for inferencing.
 * @returns {InferenceResult} The result of the inference.
 */
export function infer(model, prompt, options) {
    let inference_options = {
        maxTokens: options?.maxTokens || 100,
        repeatPenalty: options?.repeatPenalty || 1.1,
        repeatPenaltyLastNTokenCount: options?.repeatPenaltyLastNTokenCount || 64,
        temperature: options?.temperature || 0.8,
        topK: options?.topK || 40,
        topP: options?.topP || 0.9,
    };
    return llmInfer(model, prompt, inference_options);
}
/**
 * Generates embeddings for the given text using the specified model.
 * @param {EmbeddingModels | string} model - The model to use for generating embeddings.
 * @param {Array<string>} text - The text to generate embeddings for.
 * @returns {EmbeddingResult} The result of generating embeddings.
 */
export const generateEmbeddings = (model, text) => {
    return llmGenerateEmbeddings(model, text);
};
