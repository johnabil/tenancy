const DatabaseDriver = require('../helpers/db');
const QueueDriver = require('../helpers/queue');
const Config = require('../helpers/config');

module.exports = function (Request, Response, Next) {
  const central_domains = Config.getConfig().central_domains;
  const domain = Request.hostname;

  if (central_domains.includes(domain)) {
    const db_options = Config.getConfig().db_options;

    //resolving config
    Config.setConfig({
      "connection": "central",
      "queue_connection": QueueDriver.getConnectionUrl(),
    });

    //db connection
    DatabaseDriver.resolveCentralConnection(db_options);

    Next();
  } else {
    return Response.status(403).json('Invalid Domain');
  }
}
