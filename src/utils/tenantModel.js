const DBDriver = require('./db').getDriverClass();

/**
 * Find tenant by domain
 * @param {string} domain
 * @returns {Promise<TenantMongoSchema|Tenant>}
 */
function get(domain) {
  return DBDriver.getTenantModel(domain);
}

module.exports = {get}
