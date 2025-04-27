function getDriverClass() {
  const driver_name = process.env.DB_DRIVER;
  if (driver_name == null) {
    throw new Error(`DB_DRIVER undefined environment variable`);
  }

  switch (driver_name) {
    case 'mongodb':
      return require('../drivers/database/MongoDriver');
    case 'mysql' :
    case 'postgres' :
    case 'sqlite' :
    case 'mariadb' :
    case 'mssql' :
    case 'db2' :
    case 'snowflake' :
    case 'oracle':
      return require('../drivers/database/SqlDriver');
    default:
      throw new Error(`Unknown driver: ${driver_name}`);
  }
}

function resolveTenantConnection(connection, db_name, options = {}) {
  const Driver = getDriverClass();

  try {
    return Driver.connect(connection, db_name, options);
  } catch (err) {
    throw err;
  }
}

function resolveCentralConnection(options = {}) {
  const Driver = getDriverClass();
  const connection = process.env.DB_CONNECTION || process.env.DB_HOST;
  const db_name = process.env.DB_NAME;

  try {
    console.log(connection);
    return Driver.connect(connection, db_name, options);
  } catch (err) {
    throw err;
  }
}

function registerSchemas(connection, schemas) {
  const Driver = getDriverClass();

  Driver.registerSchemas(connection, schemas);
}

function getModel(model_name) {
  return getDriverClass().getModel(model_name);
}

function getDefaultTenantSchema() {
  const Driver = getDriverClass();
  return Driver.getDefaultTenantSchema();
}

module.exports = {
  getDriverClass,
  resolveTenantConnection,
  resolveCentralConnection,
  registerSchemas,
  getModel,
  getDefaultTenantSchema
};
