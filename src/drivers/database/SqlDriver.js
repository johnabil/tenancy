const Config = require('../../utils/config');
const DatabaseDriver = require('../../utils/db');
const {Sequelize} = require('sequelize');

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

function registerSchemas(connection, schemas = {}) {
  const modelDefiners = Config.getConfig()?.model_definers;

  if (modelDefiners.length > 0) {
    try {
      //defining models
      for (const modelDefiner of modelDefiners) {
        modelDefiner(connection);
      }

      //applying associations
      for (const model_name in connection.models) {
        const model = connection.models[model_name];
        if (model?.associate) {
          model.associate(connection.models);
        }
      }
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error('No provided models found.');
  }
}

function connect(connection, db_name, options = {}) {
  const dialect = process.env.DB_DRIVER;
  options.database = db_name;
  options.logging = options.logging || false;
  options.dialect = dialect;

  return new Sequelize(connection, options);
}

function getModel(model_name) {
  let connection_name = Config.getConfig()?.connection;
  switch (connection_name) {
    case 'tenant':
      return Config.getConfig()?.tenant_connection?.models[model_name];
    case'central':
      return Config.getConfig()?.central_connection?.models[model_name];
    default:
      throw new Error(`No database connections found.`);
  }
}

function getDefaultTenantSchema() {
  return require('../../schemas/sql/Tenant');
}

module.exports = {getTenantModel, connect, registerSchemas, getModel, getDefaultTenantSchema};
