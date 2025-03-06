const DBDriver = require('./db').getDriverClass();

function get(domain) {
  return DBDriver.getTenantModel(domain);
}

module.exports = {get}
