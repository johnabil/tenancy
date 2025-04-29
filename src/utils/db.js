/**
 * Get the database driver class based on environment configuration
 * @returns {SqlDriver|MongoDriver} - Database driver module
 * @throws {Error} - If DB_DRIVER is undefined or unknown
 */
function getDriverClass() {
  const driver_name = process.env.DB_DRIVER;
  if (driver_name == null) {
    throw new Error(`DB_DRIVER undefined environment variable`);
  }

  switch (driver_name) {
    case 'mongodb':
      return require('../drivers/database/MongoDriver');
    case 'mysql':
    case 'postgres':
    case 'sqlite':
    case 'mariadb':
    case 'mssql':
    case 'db2':
    case 'snowflake':
    case 'oracle':
      return require('../drivers/database/SqlDriver');
    default:
      throw new Error(`Unknown database driver: ${driver_name}`);
  }
}

/**
 * Resolve a tenant database connection
 * @param {string} connection - Connection string
 * @param {string} db_name - Database name
 * @param {Object} options - Connection options
 * @returns {Object} - Database connection
 */
function resolveTenantConnection(connection, db_name, options = {}) {
  const Driver = getDriverClass();

  try {
    return Driver.connect(connection, db_name, options);
  } catch (err) {
    throw err;
  }
}

/**
 * Resolve a central database connection
 * @param {Object} options - Connection options
 * @returns {Object} - Database connection
 */
function resolveCentralConnection(options = {}) {
  const Driver = getDriverClass();
  const connection = process.env.DB_CONNECTION || process.env.DB_HOST;
  const db_name = process.env.DB_NAME;

  if (!connection || !db_name) {
    throw new Error('Missing DB_CONNECTION/DB_HOST or DB_NAME environment variables');
  }

  try {
    return Driver.connect(connection, db_name, options);
  } catch (err) {
    console.error(`Failed to resolve central connection to ${db_name}:`, err);
    throw err;
  }
}

/**
 * Register schemas with a database connection
 * @param {Object} connection - Database connection
 * @param {Object|Array} schemas - Schemas to register
 */
function registerSchemas(connection, schemas) {
  if (!connection) {
    throw new Error('Cannot register schemas - connection is null or undefined');
  }

  if (!schemas) {
    throw new Error('Cannot register schemas - schemas parameter is null or undefined');
  }

  const Driver = getDriverClass();

  Driver.registerSchemas(connection, schemas);
}

/**
 * Get a model by name
 * @param {string} model_name - Model name
 * @returns {Object} - Model
 */
function getModel(model_name) {
  return getDriverClass().getModel(model_name);
}

/**
 * Get the default tenant schema
 * @returns {Object} - Default tenant schema
 */
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
