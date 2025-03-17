require('dotenv').config();


const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

/* --------------------Database---------------------- */
const mongoose = require('mongoose');
const {config, TenantSchema} = require('node-tenancy');
const generate_id = require('mongoose').Types;

const userSchema = new mongoose.Schema({
  _id: generate_id.ObjectId,
  username: String,
  image: String,
  meta_data: JSON,
  created_at: {type: Number, default: Math.floor(Date.now() / 1000)},
});

config.setConfig({
  "central_domains": [
    "test"
  ],
  "tenant_schemas": {
    "User": userSchema,
  },
  "central_schemas": {
    'Tenant': TenantSchema,
  },
});

/* ---------------------Queue Sender and Receiver---------------------- */
// const queueClass = require('./app/jobs/queue');
// queueClass.getMessages('support_test', true);
// queueClass.publishMessage('support_test', {'message': 'test'}, true);

/* ---------------------Routes DIR---------------------- */
const indexRouter = require('./routes/index');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // only parses json data
app.use(bodyParser.urlencoded({ // handles the urlencoded bodies
  extended: true
}));

/*enable cors*/
app.use(cors());

/* -----------------Routers-------------------- */
app.use('/api/', indexRouter);

// catch 404 and forward to error handler
app.use(function (Request, Response, Next) {
  return Response.status(404).json("Route not found");
});

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  console.log(err);
});

const server = require('http').createServer(app);

//server won't go down but will put errors in log
process.on('uncaughtException', function (error) {
  throw new Error(error.message);
});

server.listen(8000);

module.exports = app;
