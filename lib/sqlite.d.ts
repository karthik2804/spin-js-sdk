export type sqliteValues = ValueInteger | ValueReal | ValueText | ValueBlob | ValueNull;
export type ParameterValue = sqliteValues | number | bigint | null | string | Uint8Array;
export type ValueInteger = {
    tag: 'integer';
    val: number | bigint;
};
export type ValueReal = {
    tag: 'real';
    val: number | bigint;
};
export type ValueText = {
    tag: 'text';
    val: string;
};
export type ValueBlob = {
    tag: 'blob';
    val: Uint8Array;
};
export type ValueNull = {
    tag: 'null';
};
/**
 * Interface representing the formatted result of an SQLite query.
 * @interface SqliteResult
 * @property {string[]} columns - The column names in the result.
 * @property {Object<string, number | bigint | null | string | Uint8Array>[]} rows - The rows of results.
 */
export interface SqliteResult {
    columns: string[];
    rows: {
        [key: string]: number | bigint | null | string | Uint8Array;
    }[];
}
/**
 * Interface representing a connection to an SQLite database with a method for executing queries.
 * @interface SqliteConnection
 */
export interface SqliteConnection {
    /**
     * Executes an SQLite statement with given parameters and returns the result.
     * @param {string} statement - The SQL statement to execute.
     * @param {ParameterValue[]} parameters - The parameters for the SQL statement.
     * @returns {SqliteResult}
     */
    execute: (statement: string, parameters: ParameterValue[]) => SqliteResult;
}
/**
 * Opens a connection to the SQLite database with the specified label.
 * @param {string} label - The label of the database to connect to.
 * @returns {SqliteConnection} The SQLite connection object.
 */
export declare function open(label: string): SqliteConnection;
/**
 * Opens a connection to the default SQLite database.
 * @returns {SqliteConnection} The SQLite connection object.
 */
export declare function openDefault(): SqliteConnection;
