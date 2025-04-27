const {createClient} = require('redis');

async function connect(url, options = {}) {
  try {
    const basic_config = {
      url: url
    }
    let connection_options = {...basic_config, ...options}
    const client = createClient(connection_options);

    return await client.connect();
  } catch (error) {
    throw error;
  }
}

module.exports = {connect};
