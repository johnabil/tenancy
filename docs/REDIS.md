## Redis

Example of Pub-Sub with Redis:

```dotenv
#env variables that must exists
QUEUE_DRIVER=redis
QUEUE_CONNECTION=redis://test:test@redis.test
QUEUE_TENANT_CONNECTION=redis://tenant:tenant@redis.test
```

```js
const queueClass = require('queue');
queueClass.getMessages('test', true);
queueClass.publishMessage('test', {'message': 'test'}, true);
```

`queue.js`

```js
const {queue, config} = require('node-tenancy');

//connection must be set if you are not using middleware
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

async function getMessages(channel_name, is_tenant_connection = false) {
  setConnectionConfig(is_tenant_connection);

  // queue.connect(url = null, options = {})
  const client = await queue.connect();

  await client.subscribe(channel_name, (message) => {
    console.log(message);
  }, true);

  await client.close();
}

async function publishMessage(channel_name, message, is_tenant_connection = false) {
  setConnectionConfig(is_tenant_connection);

  // queue.connect(url = null, options = {})
  const client = await queue.connect();
  await client.publish(channel_name, JSON.stringify(message));
  setTimeout(function () {
    client.close();
  }, 500);
}

module.exports = {getMessages, publishMessage};
```

#### **Just be careful to provide close connection in the callback function if needed.**
