const Config = require('../../utils/config');
const DatabaseDriver = require('../../utils/db');
const {Sequelize, Model} = require('sequelize');

/**
 * Find tenant by domain
 * @param {string} domain - Domain to search for
 * @returns {Promise<Model>} - Returns a tenant document
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
 * @param {Sequelize} connection - Sequelize connection
 * @param {Function} schemas - Array of schema definers
 */
function registerSchemas(connection, schemas = null) {
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
 * @returns {Sequelize} - Sequelize connection
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
 * @param {string} model_name
 * @returns {Model}
 * @throws {Error}
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
 * @returns {(function(Sequelize): Tenant)|{}}
 */
function getDefaultTenantSchema() {
  return require('../../schemas/sql/Tenant');
}

/**
 * @typedef {Object} SqlDriver
 * @property {function(string): Promise<Model>} getTenantModel
 * @property {function(string, string, Object): Sequelize} connect
 * @property {function(Object, Object)} registerSchemas
 * @property {function(string): Model} getModel
 * @property {function(): Object} getDefaultTenantSchema
 *
 * @type SqlDriver
 */
module.exports = {
  getTenantModel,
  connect,
  registerSchemas,
  getModel,
  getDefaultTenantSchema
};
