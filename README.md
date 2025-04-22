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
| Redis                                                       | 4.7 or later    |
| Rabbitmq ([amqplib](https://www.npmjs.com/package/amqplib)) | 0.10.5 or later |

---

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

---

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

---

#### 2. Queue connection

Check out [Rabbitmq guide](docs/RABBITMQ.md) to know more.

Check out [Redis guide](docs/REDIS.md) to know more.

---

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
