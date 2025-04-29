const {createClient} = require('redis');

/**
 * Connect to Redis server
 * @param {string} url - Redis connection URL
 * @param {Object} options - Redis connection options
 * @returns {Promise<Object>} - Returns Redis client instance
 */
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

/**
 * @typedef {Object} RedisDriver
 * @property {function(string, Object=): Promise<Object>} connect
 */
/**
 * @type RedisDriver
 * @throws {Error}
 */
module.exports = {connect};
