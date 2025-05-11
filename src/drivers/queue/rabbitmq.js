const RabbitMQ = require('amqplib');


/**
 * Connect to RabbitMQ server with retry capability
 * @param {string} url - RabbitMQ connection URL
 * @param {Object} options - RabbitMQ connection options
 * @returns {Promise<Object>} - Returns RabbitMQ connection
 */
async function connect(url, options = {}) {
  try {
    return await RabbitMQ.connect(url, options);
  } catch (error) {
    throw error;
  }
}

/**
 * @typedef {Object} RabbitMQDriver
 * @property {function(string, Object=): Promise<Object>} connect
 * @type RabbitMQDriver
 * @throws {Error}
 */
module.exports = {connect};
