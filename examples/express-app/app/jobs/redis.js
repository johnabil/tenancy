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

async function getMessages(channel_name, is_tenant_connection = false) {
  setConnectionConfig(is_tenant_connection);

  // queue.connect(url = null, options = {})
  const client = await queue.connect();

  await client.subscribe(channel_name, (message) => {
    console.log(Buffer.from(message).toString());
  }, true);

  await client.quit();
}

async function publishMessage(channel_name, message, is_tenant_connection = false) {
  setConnectionConfig(is_tenant_connection);

  // queue.connect(url = null, options = {})
  const client = await queue.connect();
  await client.publish(channel_name, Buffer.from(JSON.stringify(message)));
  setTimeout(function () {
    client.quit();
  }, 500);
}

module.exports = {getMessages, publishMessage};
