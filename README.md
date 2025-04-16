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
        - [Mongoose Usage](#3-using-mongoose)
        - [Sql Usage](#4-using-sql-with-sequelize)

## Support

| **Packages**                                                | **Version**     |
|-------------------------------------------------------------|-----------------|
| mongodb                                                     | 6.13.1 or later |
| mongoose                                                    | 8.10.1 or later |
| sequelize                                                   | 6.37 or later   |
| sequelize-cli                                               | 6.6 or later    |
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

***it's recommended to upgrade to v1.1.0 because there was some connection
errors you might get with v1.0.4***

***v1.0.4***

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

***v1.1.0***

`app.js`

```js
const queueClass = require('queue');
queueClass.getMessages('support_test', true);
queueClass.publishMessage('support_test', {'message': 'test'}, true);
```

`queue.js`

```js
const {queue, config} = require('node-tenancy');

function setConnectionConfig(is_tenant_connection) {
  if (is_tenant_connection) {
    config.setConfig({
      'connection': 'tenant',
    });
  } else {
    config.setConfig({
      'connection': 'central',
    });
  }
}

async function getMessages(queue_name, is_tenant_connection = false) {
  setConnectionConfig(is_tenant_connection);

  const conn = await queue.connect(queue.getConnectionUrl());
  const channel = await conn.createChannel();

  await channel.assertQueue(queue_name);

  channel.consume(queue_name, async (msg) => {
    if (msg !== null) {
      console.log('Received:', msg.content.toString());
      channel.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
    await channel.close();
    await conn.close();
  });
}

async function publishMessage(queue_name, message, is_tenant_connection = false) {
  setConnectionConfig(is_tenant_connection);

  const conn = await queue.connect(queue.getConnectionUrl());
  const channel = await conn.createChannel();
  channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(message)));
  setTimeout(function () {
    conn.close();
  }, 500);
}

module.exports = {getMessages, publishMessage};
```

#### **Just be careful to provide close connection in the callback function if needed.**

#### 3. Using Mongoose

Please read [Mongoose guide](docs/MONGO.md) to know
in detail mongoose implementation.

#### 4. Using Sql (with sequelize)

To make it more versatile we have added
sequelize which supports multiple relational databases.
Read more about it here [Sequelize guide](docs/SQL.md).

#### Column names can not be changed:

##### Tenant table/collection:

`db_connection, db_name, db_options`

##### Domain table: `domain`

**In case you are using mongodb we assume that domains is an array inside
tenants collection**
