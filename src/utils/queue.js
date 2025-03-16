const RabbitmqDriver = require('../drivers/queue/rabbitmq');

function getConnectionUrl() {
  let driver = process.env.QUEUE_DRIVER;

  switch (driver) {
    case 'rabbitmq':
      return RabbitmqDriver.getConnectionUrl();
    default:
      return null;
  }
}

async function connect(url, options = {}) {
  return await RabbitmqDriver.connect(url, options);
}

module.exports = {getConnectionUrl, connect};
