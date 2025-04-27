const RabbitMQ = require('amqplib');

async function connect(url, options = {}) {
  try {
    return await RabbitMQ.connect(url, options);
  } catch (error) {
    throw error;
  }
}

module.exports = {connect};
