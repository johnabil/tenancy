const mongoose = require('mongoose');
const generate_id = require('mongoose').Types;

const schema = new mongoose.Schema({
  _id: generate_id.ObjectId,
  name: String,
  db_connection: String,
  db_options: JSON,
  domains: Array,
  metadata: JSON,
});

const Tenant = mongoose.model('Tenant', schema);

exports = Tenant;
