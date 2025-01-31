//@ts-ignore
import * as spinRedis from 'fermyon:spin/redis@2.0.0';
/**
 * Opens a connection to the Redis instance at the specified address.
 * @param {string} address - The address of the Redis instance.
 * @returns {RedisConnection} The Redis connection object.
 */
export function open(address) {
    return spinRedis.Connection.open(address);
}
