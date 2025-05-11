const mongoose = require('mongoose');
const generate_id = require('mongoose').Types;

/**
 * @typedef {Object} TenantMongoSchema
 * @property {mongoose.Types.ObjectId} _id - Tenant ID
 * @property {string} name - Tenant name
 * @property {string} db_connection - Database connection string
 * @property {string} db_name - Database name
 * @property {Object} db_options - Database configuration options
 * @property {string[]} domains - Array of tenant domains
 * @property {Object} metadata - Additional tenant metadata
 *
 * Tenant Schema Definition
 * @type TenantMongoSchema
 */
module.exports = new mongoose.Schema({
  _id: generate_id.ObjectId,
  name: String,
  db_connection: String,
  db_name: String,
  db_options: JSON,
  domains: Array,
  metadata: JSON,
});
