//@ts-ignore
import * as spinMysql from 'fermyon:spin/mysql@2.0.0';
import { convertRdbmsToWitTypes } from './rdbmsHelper';
function createMysqlConnection(connection) {
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
                    results.rows[rowIndex][results.columns[valIndex].name] =
                        val.tag == 'db-null' || val.tag == 'unsupported' ? null : val.val;
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
 * Opens a MySQL connection to the specified address.
 * @param {string} address - The address of the MySQL server.
 * @returns {MysqlConnection} The MySQL connection object.
 */
export function open(address) {
    return createMysqlConnection(spinMysql.Connection.open(address));
}
