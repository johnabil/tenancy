const Config = require('../utils/config');

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

async function connect(url = null, options = {}) {
  let connection_url = url || getConnectionUrl();
  return await getDriverClass().connect(connection_url, options);
}

module.exports = {getConnectionUrl, connect};
