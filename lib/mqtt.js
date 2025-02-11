//@ts-ignore
import * as spinMqtt from 'fermyon:spin/mqtt@2.0.0';
/**
 * Enum representing the Quality of Service (QoS) levels for MQTT.
 * @enum {string}
 */
export var QoS;
(function (QoS) {
    /** Messages are delivered at most once. */
    QoS["AtMostOnce"] = "at-most-once";
    /** Messages are delivered at least once. */
    QoS["AtLeastOnce"] = "at-least-once";
    /** Messages are delivered exactly once. */
    QoS["ExactlyOnce"] = "exactly-once";
})(QoS || (QoS = {}));
/**
 * Opens an MQTT connection with the specified parameters.
 * @param {string} address - The address of the MQTT broker.
 * @param {string} username - The username for the MQTT connection.
 * @param {string} password - The password for the MQTT connection.
 * @param {number} keepAliveIntervalInSecs - The keep-alive interval in seconds.
 * @returns {MqttConnection} The MQTT connection object.
 */
export function open(address, username, password, keepAliveIntervalInSecs) {
    return spinMqtt.Connection.open(address, username, password, keepAliveIntervalInSecs);
}
