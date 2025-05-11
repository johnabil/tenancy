# Tenancy for Node.js

A package to implement multi-tenant apps in Node.js or TypeScript with ease.
Inspired by [Tenancy for Laravel](https://tenancyforlaravel.com)

## Table of Contents

- [Installing](#install)
- [Usage](#usage)
    - [Env](#env-variables)
    - [Implementation](#implementation)
        - [Middleware](#1-middlewares)
        - [Queue](#2-queue-connection)
        - [Mongoose Usage](#3-using-mongoose)
        - [Sql Usage](#4-using-sql-with-sequelize)
    - [TypeScript Support](#typescript-support)
- [CHANGELOG](CHANGELOG.md) (for the latest updates and changes)

## Support

| **Packages**                                                | **Version**     |
|-------------------------------------------------------------|-----------------|
| typescript-eslint                                           | 8.31.1 or later |
| eslint                                                      | 9.25.1 or later |
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

Middlewares configure database connections so a request can be executed
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

#### 4. Using SQL (with sequelize)

To make it more versatile, we have added
sequelize, which supports multiple relational databases.
Read more about it here [Sequelize guide](docs/SQL.md).

#### Column names cannot be changed:

##### Tenant table/collection:

`db_connection, db_name, db_options`

##### Domain table: `domain`

**In case you are using mongodb, we assume that domains are an array inside
tenants collection**

## TypeScript Support

See Bun Example [here](examples/bun-app)

Tenancy now includes TypeScript type definitions. Example usage:

```typescript
import {config, TenantSchema, db} from 'node-tenancy';
import {Schema} from 'mongoose';

// Define schemas with TypeScript types
interface User {
    username: string;
    email: string;
    active: boolean;
    createdAt: Date;
}

const userSchema = new Schema<User>({
    username: String,
    email: {type: String, required: true},
    active: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now}
});

// Configure tenancy
config.setConfig({
    central_domains: ["admin.myapp.com"],
    tenant_schemas: {
        "User": userSchema
    },
    central_schemas: {
        "Tenant": TenantSchema
    }
});
```
