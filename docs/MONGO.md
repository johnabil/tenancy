## Table of Contents

- [Config](#1-config-obj)
- [Model](#2-using-app-models)

### 1. Config obj

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
  "tenant_connection": "mongoose db connection object",
  "central_connection": "mongoose db connection object",
}

//add more if needed
config.setConfig({
  "test": "new"
});
```

### 2. Using App Models

We tried to make it easy to access a specific connection model

```js
const {db} = require('node-tenancy');

db.getModel('Tenant').countDocuments().then(result => {
  console.log(result);
});
```
