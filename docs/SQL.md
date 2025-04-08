## Table of Contents

- [Supported Drivers](#1-supported-drivers)
- [Config](#2-config-obj)
- [Model](#3-using-app-models)
- [Migrations](#4-migrations)

### 1. Supported Drivers

Sequelize supports all of this database drivers

```text
mysql
postgres
sqlite
mariadb
mssql
db2
snowflake
oracle
```

Just make sure to install one of the drivers first.

```bash
# Install One of the following:
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
$ npm install --save oracledb # Oracle Database
```

### 2. Config obj

**Make sure to add those values before using middlewares.**

```js
const {TenantSchema, DomainSchema} = require('node-tenancy');
const UserSchema = require('user.js');


config.setConfig({
  "central_domains": [
    "test"
  ],
  "central_schemas": [
    TenantSchema,
    DomainSchema
  ],
  "tenant_schemas": [
    UserSchema
  ]
});
```

This is how you can make your own models.

`user.js`

```js
'use strict';

const {
  DataTypes,
  Model,
} = require('sequelize');

module.exports = (sequelize) => {

  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * This method is called after defining all app models
     */
    static associate(models) {
      // define association here
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrementIdentity: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });

  return User;
};
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
  "tenant_connection": "sequelize db connection object",
  "central_connection": "sequelize db connection object",
}

//add more if needed
config.setConfig({
  "test": "new"
});
```

### 3. Using App Models

We tried to make easy to access specific connection model

```js
const {db} = require('node-tenancy');

db.getModel('Tenant').findAll().then(tenants => {
  console.log(tenants);
});
```

### 4. Migrations

First thing you have to separate tenants migration files from central migrations
so, it's recommended to make all tenants migrations under `/migrations/tenants`.

#### Tenants Migrations Commands:

we provided some commands to make it fast to migrate all changes to
all tenants or for a specific tenant.

First, you can use sequelize CLI to create tenant migration files with
providing `--migration-path` option and provide your tenants migration
path and you can use `/migrations/tenants`
as it's the default path the package is using.

```bash
tenancy-db <command>

Commands:
  tenancy-db migrate                       Run pending migrations
  tenancy-db migrate:rollback              Rollback latest migrations
  tenancy-db migrate:fresh                 Rollback all migrations

Options:
  --help            Show help
  --t or --tenants  Apply to multiple tenants (comma seperated)
  --path            Provide custom migrations path (default is /migrations/tenants)
```

Examples:

```bash
tenancy-db migrate --path 'migrations/tenant'
```

```bash
tenancy-db migrate --tenants id1,id2
```

**We use sequelize CLI for central related migrations and models**
