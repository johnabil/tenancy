require('dotenv').config({override: true});

const db = require('../index').db;
const db_name = 'testing';
const db_utils = require('./dbUtils');
process.env.DB_NAME = db_name;
test('Resolve Central Connection', () => {
  const mockFunction = jest.fn(db.resolveCentralConnection);

  mockFunction();
  db.getDriverClass().disconnect();
  expect(mockFunction.mock.results[0].value.name).toBe(db_name);
});

test('Resolve Tenant Connection', () => {
  switch (db.getDriverClass()) {
    case 'mongodb':
      db_utils.mongoTenantMock();
      break;
  }
});

test('Tenant Default Schema test', () => {
  const mockFunction = jest.fn(db.getDefaultTenantSchema);

  mockFunction();
  const schemaKeys = Object.keys(mockFunction.mock.results[0].value.tree);
  const tenantSchema = require('../index').TenantSchema;
  const tenantSchemaKeys = Object.keys(tenantSchema.obj);

  expect(schemaKeys).toEqual(expect.arrayContaining(tenantSchemaKeys));
});
