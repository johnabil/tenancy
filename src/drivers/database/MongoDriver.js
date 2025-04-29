const mongoose = require('mongoose');
const Config = require('../../utils/config');
const DatabaseDriver = require('../../utils/db');

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

    model = connection.model('Tenant');

    return model.findOne({domains: {$in: [domain]}});
  }
}

/**
 * Register schemas with Mongoose connection
 * @param {Object} connection - Mongoose connection
 * @param {Object} schemas - Object containing schemas to register
 */
function registerSchemas(connection, schemas = {}) {
  if (Object.keys(schemas).length > 0) {
    try {
      for (const model_name in schemas) {
        if (!connection.models[model_name]) {
          connection.model(model_name, schemas[model_name]);
        }
      }
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error('No provided schemas found.');
  }
}

/**
 * Create a MongoDB connection
 * @param {string} connection - MongoDB connection string
 * @param {string} db_name - Database name
 * @param {Object} options - MongoDB connection options
 * @returns {Object} - Mongoose connection
 */
function connect(connection, db_name, options = {}) {
  const db_connection = mongoose.createConnection(connection, options);
  return db_connection.useDb(db_name, {useCache: true});
}

/**
 * Disconnect from MongoDB
 */
function disconnect() {
  mongoose.disconnect().catch((err) => {
    throw err
  });
}

/**
 * Get a model by name from the current connection
 * @param {string} model_name - Model name
 * @returns {Object} - Mongoose model
 */
function getModel(model_name) {
  let connection_name = Config.getConfig()?.connection;

  switch (connection_name) {
    case 'tenant':
      return Config.getConfig()?.tenant_connection.model(model_name);
    case 'central':
      return Config.getConfig()?.central_connection.model(model_name);
    default:
      throw new Error(`No database connections found.`);
  }
}

/**
 * Get the default tenant schema
 * @returns {Object} - Mongoose schema for tenant
 */
function getDefaultTenantSchema() {
  return require('../../schemas/mongodb/Tenant');
}

module.exports = {
  getTenantModel,
  connect,
  disconnect,
  registerSchemas,
  getModel,
  getDefaultTenantSchema
};
