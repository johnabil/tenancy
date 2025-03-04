const tenantModel = require('../helpers/tenantModel');
const DatabaseDriver = require('../helpers/db');
const QueueDriver = require('../helpers/queue');
const Config = require('../helpers/config');

module.exports = function (Request, Response, Next) {
  const domain = Request.hostname;

  tenantModel.get(domain).then(tenant => {
    if (tenant) {
      //resolving config
      Config.setConfig({
        "connection": "tenant",
        "tenant_i": tenant._id,
        "queue_connection": QueueDriver.getConnectionUrl(),
      });

      //db connection
      DatabaseDriver.resolveTenantConnection(tenant.db_connection, tenant.db_options);

      Next();
    } else {
      return Response.status(400).json("Failed to initialize Tenant");
    }
  });
}
