# Changelog

## v1.2.1 - 27 Apr, 2025

### Features

- Adding Redis support.

### Breaking Changes

- Queue connection env values must be `QUEUE_CONNECTION` & `QUEUE_TENANT_CONNECTION`
  instead of `RABBITMQ_CONNECTION` & `RABBITMQ_TENANT_CONNECTION`.

### Enhancements

- Improving `queue.connect(url = null, options = {})` method.
  but you can still use it as before.
- Adding github actions for running `npm test`.
- Improve queue test cases.

```js
const {queue, config} = require('node-tenancy');

//old way
const connection = await queue.connect(queue.getConnectionUrl()); //old way
//new way
const connection = await queue.connect(); //new way
//new way with custom url connection
const connection = await queue.connect('redis://test:test@redis.test');
```

---

## v1.2.0 - 16 Apr, 2025

### Features

- Adding sequelize support.
- Adding sequelize tenancy command lines for migrations.

### Enhancements

- Refactor some db driver class and mongo driver class methods.

---

## v1.1.0 - 16 Mar, 2025

Adding jest tests and some code improvements to queue connection.

### Code Improvements

This is an example of how to use the queue class in v1.1.0 or later.

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

---

## v1.0.4 - 7 Mar, 2025

### File Structure

Changes to all project file structure and namings to match most
used naming conventions.

### Code Improvements

***It's recommended to upgrade to v1.1.0 because there was some connection
errors you might get with v1.0.4***

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
