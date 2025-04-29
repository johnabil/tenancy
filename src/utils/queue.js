const Config = require('../utils/config');

/**
 * Get the queue driver class based on environment configuration
 * @returns {RabbitMQDriver|RedisDriver}
 * @throws {Error}
 */
function getDriverClass() {
  let driver = process.env.QUEUE_DRIVER;

  switch (driver) {
    case 'rabbitmq':
      return require('../drivers/queue/rabbitmq');
    case 'redis':
      return require('../drivers/queue/redis');
    default:
      throw new Error(`Unknown driver: ${driver}`);
  }
}

/**
 * Get the connection URL based on the current connection
 * @returns {string|null}
 */
function getConnectionUrl() {
  let connection = Config.getConfig().connection;

  switch (connection) {
    case 'tenant':
      return process.env.QUEUE_TENANT_CONNECTION;
    case 'central':
      return process.env.QUEUE_CONNECTION;
    default:
      return null;
  }
}

/**
 * Connect to the queue server based on the current connection
 * @param url
 * @param options
 * @returns {Promise<Object>}
 */
async function connect(url = null, options = {}) {
  let connection_url = url || getConnectionUrl();
  return await getDriverClass().connect(connection_url, options);
}

module.exports = {getConnectionUrl, connect};
