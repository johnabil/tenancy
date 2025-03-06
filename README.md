# Tenancy for Node.js

a package to implement multi tenant apps in node with ease.
Trying to make it like [Tenancy for Laravel](https://tenancyforlaravel.com)

## Table of Contents

- [Installing](#install)
- [Usage](#usage)
    - [Env](#env-variables)
    - [Implementation](#implementation)
        - [Middleware](#1-middlewares)
        - [Queue](#2-queue-connection)
        - [Config](#3-config-obj)
        - [Models](#4-using-app-models)

## Support

| **Packages**                                                | **Version**     |
|-------------------------------------------------------------|-----------------|
| mongodb                                                     | 6.13.1 or later |
| mongoose                                                    | 8.10.1 or later |
| Rabbitmq ([amqplib](https://www.npmjs.com/package/amqplib)) | 0.10.5 or later |

## Install

```bash
npm i node-tenancy
```

## Usage

### Env variables

Here are some env variables to include in you `.env` file.

```dotenv
QUEUE_DRIVER=rabbitmq
DB_DRIVER=mongodb
DB_CONNECTION=mongodb://127.0.0.1:27017/database
RABBITMQ_CONNECTION=amqp://user:password@127.0.0.1
```

### Implementation

So we will provide some steps to begin your SaaS app with ease.

#### 1. Middlewares

Middlewares configure database connections so request can be executed
for each tenant based on domains registered to each tenant.

* Tenancy Middleware should be used in tenancy `tenantRoute.js`.

```js
const express = require('express');
const router = express.Router();
const tenancy = require('node-tenancy');

router.use(tenancy.initializeTenancyMiddleware);

router.get('/get', function (Request, Response) {
  return Response.status(200).json("Hello");
});
```

* Central Middleware should be used in tenancy `centralRoutes.js`.

```js
const express = require('express');
const router = express.Router();
const tenancy = require('node-tenancy');

router.use(tenancy.initializeCentralMiddleware);

router.get('/get', function (Request, Response) {
  return Response.status(200).json({
    'tenant_id': tenancy.config.getConfig().tenant_id
  });
});
```

#### 2. Queue connection

Currently, we are only supporting `rabbitmq` hoping to provide
more in the future.

```js
const {queue} = require('node-tenancy');

queue.connect(queue.getConnectionUrl(), function (connectionErr, connection) {
  if (connectionErr) {
    console.log(connectionErr);
  }
  connection.createChannel(function (channelErr, channel) {
    if (channelErr) {
      console.log(channelErr);
    }

    const queue = 'test';

    channel.assertQueue(queue, {
      durable: true
    });

    channel.consume(queue, function (msg) {
      console.log(msg);
    });
  })
});
```

#### **Just be careful to provide close connection in the callback function if needed.**

#### 3. Config obj

**Make sure to add those values before using middlewares.**

```js
const {config} = require('node-tenancy');


config.setConfig({
  "central_domains": [
    "test"
  ],
  "tenant_schemas": {
    "Model": require('Schema')
  },
  "central_schemas": {
    'Tenant': tenancy.TenantSchema,
  }
});
```

`Schema.js`

```js
const generate_id = require('mongoose').Types;

module.exports = new mongoose.Schema({
  _id: generate_id.ObjectId,
  type: String,
  meta_data: JSON,
  created_at: {type: Number, default: Math.floor(Date.now() / 1000)},
  last_push_sent: {type: Number, default: 1}
});
```

We made useful config obj to make it easier to access some values.
Ex:

```js
const {config} = require('node-tenancy');

//values exists
const tenancy_config = {
  "connection": "tenant", // central in case of central connection
  "queue_connection": "", // null by default
  "tenant_id": "example",
  "tenant_connection": "db connection object",
  "central_connection": "db connection object",
}

//add more if needed
config.setConfig({
  "test": "new"
});
```

#### 4. Using App Models

We tried to make easy to access specific connection model

```js
const tenancy = require('node-tenancy');

tenancy.db.getModel('Notification').countDocuments().then(result => {
  console.log(result);
});
```
