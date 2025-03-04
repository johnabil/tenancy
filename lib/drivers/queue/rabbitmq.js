const Config = require('../../helpers/config');
const RabbitMQ = require('amqplib/callback_api');


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

function connect(url, callback, options = {}) {
  try {
    RabbitMQ.connect(url, options, callback);
  } catch (error) {
    throw error;
  }
}

module.exports = {getConnectionUrl, connect};
