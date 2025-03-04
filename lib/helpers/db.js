function getTenantModel() {
  let driver_name = process.env.DB_DRIVER;
  if (driver_name == null) {
    throw new Error(`DB_DRIVER undefined environment variable`);
  }

  switch (driver_name) {
    case 'mongodb':
      return require('../drivers/database/MongoDriver');
    default:
      throw new Error(`Unknown driver: ${driver_name}`);
  }
}

function resolveTenantConnection(connection, options = {}) {
  let Driver = this.getDriverClass();

  Driver.disconnect();
  Driver.connect(connection, options).catch((err) => {
    throw err;
  });
}

function resolveCentralConnection(options = {}) {
  let Driver = this.getDriverClass();
  let connection = process.env.DB_CONNECTION || process.env.DB_HOST;

  Driver.disconnect();
  Driver.connect(connection, options).catch((err) => {
    throw err;
  });
}

module.exports = {getTenantModel, resolveTenantConnection, resolveCentralConnection};
