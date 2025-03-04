require('dotenv').config();

const db = require('./lib/helpers/db');
const config = require('./lib/helpers/config');
const queue = require('./lib/helpers/queue');

module.exports = {
  'initializeTenancyMiddleware': require('./lib/middlewares/InitializeTenancy'),
  'initializeCentralMiddleware': require('./lib/middlewares/InitializeCentralConnection'),
  'db': db,
  'config': config,
  'queue': queue,
}
