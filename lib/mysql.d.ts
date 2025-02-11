import { RdbmsParameterValue, RdbmsRowSet } from './types/rdbms';
/**
 * Interface representing a MySQL connection with methods for querying and executing statements.
 * @interface MysqlConnection
 */
export interface MysqlConnection {
    query: (statement: string, params: RdbmsParameterValue[]) => RdbmsRowSet;
    execute: (statement: string, params: RdbmsParameterValue[]) => number;
}
/**
 * Opens a MySQL connection to the specified address.
 * @param {string} address - The address of the MySQL server.
 * @returns {MysqlConnection} The MySQL connection object.
 */
export declare function open(address: string): MysqlConnection;
