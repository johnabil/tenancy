function getDriverClass() {
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

function resolveTenantConnection(connection, db_name, options = {}) {
  let Driver = this.getDriverClass();

  try {
    const db_connection = Driver.connect(connection, options);
    return db_connection.useDb(db_name, {useCache: true});
  } catch (err) {
    throw err;
  }
}

function resolveCentralConnection(options = {}) {
  let Driver = this.getDriverClass();
  let connection = process.env.DB_CONNECTION || process.env.DB_HOST;
  let db_name = process.env.DB_NAME;

  try {
    const db_connection = Driver.connect(connection, options);
    return db_connection.useDb(db_name, {useCache: true});
  } catch (err) {
    throw err;
  }
}

function registerSchemas(connection, schemas) {
  let Driver = this.getDriverClass();

  Driver.registerSchemas(connection, schemas);
}

function getModel(model_name) {
  return this.getDriverClass().getModel(model_name);
}

module.exports = {getDriverClass, resolveTenantConnection, resolveCentralConnection, registerSchemas, getModel};
