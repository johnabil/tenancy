const DatabaseDriver = require('../helpers/db');
const QueueDriver = require('../helpers/queue');
const Config = require('../helpers/config');

module.exports = function (Request, Response, Next) {
  const central_domains = Config.getConfig().central_domains;
  const domain = Request.hostname;

  if (central_domains.includes(domain)) {
    //db connection
    const db_options = Config.getConfig().db_options;
    const connection = DatabaseDriver.resolveCentralConnection(db_options);
    const central_schemas = Config.getConfig()?.central_schemas;

    if (central_schemas) {
      DatabaseDriver.registerSchemas(connection, central_schemas);
    } else {
      throw new Error('No provided schemas found.');
    }

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
