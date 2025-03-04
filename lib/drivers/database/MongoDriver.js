const mongoose = require('mongoose');
const tenant_model_names = ['Tenant', 'tenant'];
const registered_model_names = mongoose.modelNames();

function getTenantModel(domain) {
  let model = null;

  for (const model_name of tenant_model_names) {
    if (registered_model_names.includes(model_name)) {
      model = mongoose.model(model_name);
    }
  }

  if (!model) {
    model = require('../../models/mongodb/Tenant');
  } else {
    let tenant = model.findOne({domains: {$in: [domain]}}).then((tenant) => {
      if (!tenant) {
        throw new Error('No tenant model found');
      } else {
        return tenant;
      }
    });

    return tenant;
  }
}

function connect(connection, options) {
  if (!options || options.length == 0) {
    options = {};
  }

  mongoose.connect(connection, options).catch((err) => {
    throw err
  });
}

function disconnect() {
  mongoose.disconnect().catch((err) => {
    throw err
  });
}

module.exports = {getTenantModel, connect, disconnect};
