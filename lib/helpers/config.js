let config = {
  "connection": null,
  "central_domains": [],
};

function setConfig(configObj) {
  config = {...config, ...configObj};
}

function getConfig() {
  return config;
}

module.exports = {config, setConfig, getConfig};
