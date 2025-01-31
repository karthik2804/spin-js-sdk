import { RdbmsParameterValue, RdbmsRowSet } from './types/rdbms';
/**
 * Interface representing a PostgreSQL connection with methods for querying and executing statements.
 * @interface PostgresConnection
 */
export interface PostgresConnection {
    /**
     * Queries the database with the specified statement and parameters.
     * @param {string} statement - The SQL statement to execute.
     * @param {RdbmsParameterValue[]} params - The parameters for the SQL statement.
     * @returns {RdbmsRowSet} The result set of the query.
     */
    query: (statement: string, params: RdbmsParameterValue[]) => RdbmsRowSet;
    /**
     * Executes a statement on the database with the specified parameters.
     * @param {string} statement - The SQL statement to execute.
     * @param {RdbmsParameterValue[]} params - The parameters for the SQL statement.
     * @returns {number} The number of rows affected by the execution.
     */
    execute: (statement: string, params: RdbmsParameterValue[]) => number;
}
/**
 * Opens a PostgreSQL connection to the specified address.
 * @param {string} address - The address of the PostgreSQL server.
 * @returns {PostgresConnection} The PostgreSQL connection object.
 */
export declare function open(address: string): PostgresConnection;
