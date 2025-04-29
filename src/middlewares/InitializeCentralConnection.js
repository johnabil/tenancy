const DatabaseDriver = require('../utils/db');
const QueueDriver = require('../utils/queue');
const Config = require('../utils/config');


/**
 * Middleware to initialize central database connection
 * Used for admin routes that manage multiple tenants
 *
 * @returns {Promise<void>}
 * @param Request
 * @param Response
 * @param Next
 */
module.exports = function (Request, Response, Next) {
  const central_domains = Config.getConfig().central_domains;
  const domain = Request.hostname;

  if (central_domains.includes(domain)) {
    //db connection
    const db_options = Config.getConfig().db_options;
    const connection = DatabaseDriver.resolveCentralConnection(db_options);
    // register schemas
    const central_schemas = Config.getConfig()?.central_schemas;
    DatabaseDriver.registerSchemas(connection, central_schemas);

    //resolving config
    Config.setConfig({
      "connection": "central",
      "queue_connection": QueueDriver.getConnectionUrl(),
      "central_connection": connection,
    });

    Next();
  } else {
    return Response.status(403).json('Invalid Domain');
  }
}
