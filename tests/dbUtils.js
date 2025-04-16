const {MongoClient} = require('mongodb');
const {db} = require('../index');
const {Sequelize} = require('sequelize');

function mongoTenantMock() {
  let connection;
  let db_connection;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db_connection = await connection.db(process.env.DB_NAME);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create tenant mock', async () => {
    const tenants = db_connection.collection('tenants');

    const mockTenant = {_id: 'testing-tenant', name: 'testing', 'domains': ['testing']};
    await tenants.insertOne(mockTenant);

    const insertedTenant = await tenants.findOne({_id: 'some-user-id'});
    const mockFunction = await jest.fn(db.resolveTenantConnection(process.env.DB_CONNECTION, process.env.DB_NAME));

    expect(insertedTenant).toEqual(mockTenant);
    expect(mockFunction.mock.results[0].value.name).toBe(process.env.DB_NAME);
  });
}

function sqlTenantMock() {
  let connection;

  beforeAll(async () => {
    connection = await new Sequelize(process.env.DB_CONNECTION, {
      database: process.env.DB_NAME,
    });
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create tenant mock', async () => {
    const tenant_model = require('../src/schemas/sql/Tenant');
    tenant_model(connection);

    const mockTenant = {
      id: '61d66d7a-d0e5-48fa-bc17-efdf3f6d097c',
      name: 'testing',
      db_connection: process.env.DB_CONNECTION,
      db_name: process.env.DB_NAME,
    };
    await connection.models.Tenant.create(mockTenant);

    await connection.models.Tenant.count().then((count) => {
      expect(count).toBeGreaterThanOrEqual(1);
    });
    const mockFunction = await jest.fn(db.resolveTenantConnection(process.env.DB_CONNECTION, process.env.DB_NAME));
    expect(mockFunction.mock.results[0].value.name).toBe(process.env.DB_NAME);
  });
}

module.exports = {mongoTenantMock, sqlTenantMock};


