const DBDriver = require('./db').getDriverClass();

function get(domain) {
  DBDriver.getTenantModel(domain).then((tenant) => {
    if (tenant)
      return tenant;
  });
}

module.exports = {get}
