const {MongoClient} = require('mongodb');
const {initializeTenancyMiddleware, db} = require('../index');

function mongoTenantMock() {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(process.env.DB_NAME);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should create tenant mock', async () => {
    const tenants = db.collection('tenants');

    const mockTenant = {_id: 'testing-tenant', name: 'testing', 'domains': ['testing']};
    await tenants.insertOne(mockTenant);

    const insertedTenant = await tenants.findOne({_id: 'some-user-id'});
    const mockFunction = await jest.fn(db.resolveTenantConnection(process.env.DB_CONNECTION, process.env.DB_NAME));

    expect(insertedTenant).toEqual(mockTenant);
    expect(mockFunction.mock.results[0].value.name).toBe(process.env.DB_NAME);
  });
}

module.exports = {mongoTenantMock};


