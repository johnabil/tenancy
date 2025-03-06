const mongoose = require('mongoose');
const tenant_model_names = ['Tenant', 'tenant'];
const db = require('../../helpers/db');
const config = require('../../helpers/config');
const Config = require("node-tenancy/lib/helpers/config");
const DatabaseDriver = require("node-tenancy/lib/helpers/db");
const generate_id = require('mongoose').Types;

function getTenantModel(domain) {
  let model = null;
  const connection = db.resolveCentralConnection();

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
  let connection_name = config.getConfig()?.connection;

  switch (connection_name) {
    case 'tenant':
      return config.getConfig()?.tenant_connection.model(model_name);
    case'central':
      return config.getConfig()?.central_connection.model(model_name);
    default:
      throw new Error(`No database connections found.`);
  }
}

module.exports = {getTenantModel, connect, disconnect, registerSchemas, getModel};
