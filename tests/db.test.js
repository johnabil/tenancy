require('dotenv').config({override: true});

const {db} = require('../index');
const db_name = 'testing';
const db_utils = require('./dbUtils');
process.env.DB_NAME = db_name;
test('Resolve Central Connection', () => {
  const mockFunction = jest.fn(db.resolveCentralConnection);

  mockFunction();
  if (db.getDriverClass()?.disconnect) {//used only to prevent mongoose opened connection error
    db.getDriverClass()?.disconnect();
  }
  expect(mockFunction.mock.results[0].value.name || mockFunction.mock.results[0].value.config.database).toBe(db_name);
});

test('Resolve Tenant Connection', () => {
  switch (db.getDriverClass()) {
    case 'mongodb':
      db_utils.mongoTenantMock();
      break;
    case 'postgres':
      db_utils.sqlTenantMock();
      break;
  }
});

test('Tenant Default Schema test', () => {
  const mockFunction = jest.fn(db.getDefaultTenantSchema);

  mockFunction();
  const schemaKeys = Object.keys(mockFunction.mock.results[0].value?.tree || {});
  const tenantSchema = require('../index').TenantSchema;
  const tenantSchemaKeys = Object.keys(tenantSchema?.obj || {});

  expect(schemaKeys).toEqual(expect.arrayContaining(tenantSchemaKeys));
  if (process.env.DB_DRIVER !== 'mongodb') {
    expect(mockFunction.mock.results[0].value).not.toBeNull();
  }
});
