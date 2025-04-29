const Config = require('../../utils/config');
const DatabaseDriver = require('../../utils/db');
const {Sequelize} = require('sequelize');

/**
 * Find tenant by domain
 * @param {string} domain - Domain to search for
 * @returns {Promise<Object>} - Returns tenant document
 */
function getTenantModel(domain) {
  let model = null;
  const connection = DatabaseDriver.resolveCentralConnection();

  if (!connection) {
    throw new Error(`No database connections found`);
  } else {
    const central_schemas = Config.getConfig()?.central_schemas;

    if (central_schemas) {
      DatabaseDriver.registerSchemas(connection, central_schemas);
    } else {
      throw new Error('No provided schemas found.');
    }

    model = connection.models.Tenant;
    const domainModel = connection.models.Domain;

    return model.findOne({
      include: {
        model: domainModel,
        where: {
          domain: domain
        },
      },
    });
  }
}

/**
 * Register schemas with Sequelize connection
 * @param {Object} connection - Sequelize connection
 * @param {Class} schemas - Array of schema definers
 */
function registerSchemas(connection, schemas= null) {
  try {
    // Defining models
    for (const modelDefiner of schemas) {
      modelDefiner(connection);
    }

    // Applying associations
    for (const model_name in connection.models) {
      const model = connection.models[model_name];
      if (model?.associate) {
        model.associate(connection.models);
      }
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Create a SQL database connection
 * @param {string} connection - SQL connection string
 * @param {string} db_name - Database name
 * @param {Object} options - SQL connection options
 * @returns {Object} - Sequelize connection
 */
function connect(connection, db_name, options = {}) {
  const dialect = process.env.DB_DRIVER;
  options.database = db_name;
  options.logging = options.logging || false;
  options.dialect = dialect;

  return new Sequelize(connection, options);
}

/**
 * Get a model by name from the current connection
 * @param {string} model_name - Model name
 * @returns {Object} - Sequelize model
 */
function getModel(model_name) {
  let connection_name = Config.getConfig()?.connection;

  switch (connection_name) {
    case 'tenant':
      return Config.getConfig()?.tenant_connection?.models[model_name];
    case 'central':
      return Config.getConfig()?.central_connection?.models[model_name];
    default:
      throw new Error(`No database connections found.`);
  }
}

/**
 * Get the default tenant schema
 * @returns {Function} - Schema definer for Tenant
 */
function getDefaultTenantSchema() {
  return require('../../schemas/sql/Tenant');
}

module.exports = {
  getTenantModel,
  connect,
  registerSchemas,
  getModel,
  getDefaultTenantSchema
};
