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
