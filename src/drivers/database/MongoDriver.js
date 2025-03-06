const mongoose = require('mongoose');
const Config = require('../../utils/config');
const DatabaseDriver = require('../../utils/db');

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

function registerSchemas(connection, schemas = {}) {
  for (const model_name in schemas) {
    connection.model(model_name, schemas[model_name]);
  }
}

function connect(connection, options = {}) {
  return mongoose.createConnection(connection, options);
}

function disconnect() {
  mongoose.disconnect().catch((err) => {
    throw err
  });
}

function getModel(model_name) {
  let connection_name = Config.getConfig()?.connection;

  switch (connection_name) {
    case 'tenant':
      return Config.getConfig()?.tenant_connection.model(model_name);
    case'central':
      return Config.getConfig()?.central_connection.model(model_name);
    default:
      throw new Error(`No database connections found.`);
  }
}

function getDefaultTenantSchema() {
  return require('../../schemas/mongodb/Tenant');
}

module.exports = {getTenantModel, connect, disconnect, registerSchemas, getModel, getDefaultTenantSchema};
