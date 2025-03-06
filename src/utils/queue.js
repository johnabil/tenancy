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

function connect(url, callback, options = {}) {
  RabbitmqDriver.connect(url, options, callback);
}

module.exports = {getConnectionUrl, connect};
