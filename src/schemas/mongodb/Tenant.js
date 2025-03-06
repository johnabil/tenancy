const mongoose = require('mongoose');
const generate_id = require('mongoose').Types;

module.exports = new mongoose.Schema({
  _id: generate_id.ObjectId,
  name: String,
  db_connection: String,
  db_name: String,
  db_options: JSON,
  domains: Array,
  metadata: JSON,
});
