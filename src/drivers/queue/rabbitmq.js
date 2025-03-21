const Config = require('../../utils/config');
const RabbitMQ = require('amqplib');


function getConnectionUrl() {
  let connection = Config.getConfig().connection;

  switch (connection) {
    case 'tenant':
      return process.env.RABBITMQ_TENANT_CONNECTION;
    case 'central':
      return process.env.RABBITMQ_CONNECTION;
    default:
      return null;
  }
}

async function connect(url, options = {}) {
  try {
    return await RabbitMQ.connect(url, options);
  } catch (error) {
    throw error;
  }
}

module.exports = {getConnectionUrl, connect};
