const Config = require('../../helpers/config');


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

module.exports = {getConnectionUrl};
