/**
 * Type for the resolve function that handles sending the final Response.
 */
type ResolveFunction = (value: Response | PromiseLike<Response>) => void;
/**
 * Class for building HTTP responses.
 */
export declare class ResponseBuilder {
    headers: Headers;
    statusCode: number;
    private hasWrittenHeaders;
    private hasSentResponse;
    private resolveFunction;
    private internalWriter;
    constructor(resolve: ResolveFunction);
    /**
     * Sets the HTTP status code for the response.
     * @param code - The HTTP status code to set.
     * @returns The current ResponseBuilder instance for chaining.
     * @throws Error if headers have already been sent.
     */
    status(code: number): ResponseBuilder;
    /**
     * Gets the currently set HTTP status code.
     * @returns The HTTP status code.
     */
    getStatus(): number;
    /**
     * Sets response headers.
     * @param arg1 - Header name, object containing headers, or Headers instance.
     * @param arg2 - Optional header value (if arg1 is a string).
     * @returns The current ResponseBuilder instance for chaining.
     * @throws Error if headers have already been sent or if arguments are invalid.
     */
    set(arg1: string | {
        [key: string]: string;
    } | Headers, arg2?: string): ResponseBuilder;
    /**
     * Sends the HTTP response.
     * @param value - Optional body content to send with the response.
     * @throws Error if the response has already been sent.
     */
    send(value?: BodyInit): void;
    /**
     * Writes data to a streaming response.
     * @param value - The data to write to the response.
     * @throws Error if the response has already been sent.
     */
    write(value: BodyInit): void;
    /**
     * Ends a streaming response by closing the writer.
     * If not already streaming, it sends the response.
     * @throws Error if the response has already been sent.
     */
    end(): void;
}
export {};
