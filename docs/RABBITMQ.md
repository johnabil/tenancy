## RabbitMQ

Here you will find a provided example of how to use RabbitMQ.

```dotenv
#env variables that must exists
QUEUE_DRIVER=rabbitmq
QUEUE_CONNECTION=
QUEUE_TENANT_CONNECTION=
```

`app.js`

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

async function getMessages(queue_name, is_tenant_connection = false) {
  setConnectionConfig(is_tenant_connection);

  // queue.connect(url = null, options = {})
  const conn = await queue.connect();
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

  // queue.connect(url = null, options = {})
  const conn = await queue.connect();
  const channel = await conn.createChannel();
  channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(message)));
  setTimeout(function () {
    conn.close();
  }, 500);
}

module.exports = {getMessages, publishMessage};
```

#### **Just be careful to provide a close connection in the callback function if needed.**
