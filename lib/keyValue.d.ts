/**
 * Interface representing a key-value store with various utility methods.
 * @interface Store
 */
export interface Store {
    /**
     * Retrieves the value associated with the given key.
     * @param {string} key - The key to retrieve the value for.
     * @returns {Uint8Array | null} The value associated with the key, or null if the key does not exist.
     */
    get: (key: string) => Uint8Array | null;
    /**
     * Sets the value for the given key.
     * @param {string} key - The key to set the value for.
     * @param {Uint8Array | string | object} value - The value to set. Can be a Uint8Array, string, or object.
     */
    set: (key: string, value: Uint8Array | string | object) => void;
    /**
     * Deletes the value associated with the given key.
     * @param {string} key - The key to delete the value for.
     */
    delete: (key: string) => void;
    /**
     * Checks if a key exists in the store.
     * @param {string} key - The key to check.
     * @returns {boolean} True if the key exists, false otherwise.
     */
    exists: (key: string) => boolean;
    /**
     * Retrieves all the keys in the store.
     * @returns {string[]} An array of all the keys in the store.
     */
    getKeys: () => string[];
    /**
     * Retrieves the JSON value associated with the given key.
     * @param {string} key - The key to retrieve the JSON value for.
     * @returns {any} The JSON value associated with the key.
     */
    getJson: (key: string) => any;
    /**
     * Sets the JSON value for the given key.
     * @param {string} key - The key to set the JSON value for.
     * @param {any} value - The JSON value to set.
     */
    setJson: (key: string, value: any) => void;
}
/**
 * Opens a key-value store with the specified label.
 * @param {string} label - The label of the key-value store to open.
 * @returns {Store} The key-value store object.
 */
export declare function open(label: string): Store;
/**
 * Opens the default key-value store.
 * @returns {Store} The default key-value store object.
 */
export declare function openDefault(): Store;
