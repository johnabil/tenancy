require('dotenv').config();

const db = require('./src/utils/db');
const config = require('./src/utils/config');
const queue = require('./src/utils/queue');
const initializeTenancyMiddleware = require('./src/middlewares/InitializeTenancy');
const initializeCentralMiddleware = require('./src/middlewares/InitializeCentralConnection');
const TenantSchema = db.getDefaultTenantSchema();
const DomainSchema = require('./src/schemas/sql/Domain');

module.exports = {
  db,
  config,
  queue,
  initializeCentralMiddleware,
  initializeTenancyMiddleware,
  TenantSchema,
  DomainSchema
};
