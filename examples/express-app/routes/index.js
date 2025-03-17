let express = require('express');
let router = express.Router();
const {initializeTenancyMiddleware, config} = require('node-tenancy');

router.use(initializeTenancyMiddleware);

router.get('/', function (Request, Response) {
  return Response.status(200).json({'tenant_id': config.getConfig().tenant_id});
});

module.exports = router;
