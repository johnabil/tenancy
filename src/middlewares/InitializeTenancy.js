const tenantModel = require('../utils/tenantModel');
const DatabaseDriver = require('../utils/db');
const QueueDriver = require('../utils/queue');
const Config = require('../utils/config');


/**
 * Middleware to initialize multi-tenancy based on domain
 * Resolves the tenant connection and schemas for the current request
 *
 * @param {Object} Request
 * @param Response
 * @param Next
 * @returns {Promise<void>}
 */
module.exports = function (Request, Response, Next) {
  const domain = Request.hostname;

  tenantModel.get(domain).then(tenant => {
    if (tenant) {
      //db connection
      if (!tenant.db_connection || !tenant.db_name) {
        return Response.status(404).json("Failed connecting to tenant database");
      }
      const connection = DatabaseDriver.resolveTenantConnection(tenant.db_connection, tenant.db_name, tenant.db_options);
      //register schemas
      let tenant_schemas = Config.getConfig()?.tenant_schemas;
      DatabaseDriver.registerSchemas(connection, tenant_schemas);

      //resolving config
      Config.setConfig({
        "connection": "tenant",
        "tenant_id": tenant._id || tenant.id,
        "queue_connection": QueueDriver.getConnectionUrl(),
        "tenant_connection": connection,
      });

      Next();
    } else {
      return Response.status(404).json("Tenant Not found");
    }
  });
}
