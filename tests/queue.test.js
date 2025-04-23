require('dotenv').config({override: true});

const {config, queue} = require('../index');

test('Queue central connection', () => {
  config.setConfig({
    'connection': 'central',
  });

  const mockFunction = jest.fn(queue.getConnectionUrl);
  mockFunction();

  expect(mockFunction).toHaveReturned();
  expect(mockFunction.mock.results[0].value).not.toBeNull();
});

test('Queue tenant connection', () => {
  config.setConfig({
    'connection': 'tenant',
  });

  const mockFunction = jest.fn(queue.getConnectionUrl);
  mockFunction();

  expect(mockFunction).toHaveReturned();
  expect(mockFunction.mock.results[0].value).not.toBeNull();
});

describe('Rabbitmq connection', () => {
  config.setConfig({
    'connection': 'tenant',
  });

  const channelQueue = 'test';
  let connection;
  let channel;

  beforeAll(async () => {
    process.env.QUEUE_DRIVER = 'rabbitmq';
    process.env.QUEUE_CONNECTION = process.env.rQUEUE_CONNECTION;
    process.env.QUEUE_TENANT_CONNECTION = process.env.rQUEUE_TENANT_CONNECTION;
    connection = await queue.connect();
    channel = await connection.createChannel();

    await channel.assertQueue(channelQueue, {
      durable: true
    });
  });

  afterAll(async () => {
    await channel.close();
    await connection.close();
  });

  it('Rabbitmq connection callback', async () => {
    expect(connection).not.toBeNull();
    expect(channel).not.toBeNull();
  });
});

describe('Redis connection', () => {
  config.setConfig({
    'connection': 'tenant',
  });

  let connection;

  beforeAll(async () => {
    process.env.QUEUE_DRIVER = 'redis';
    process.env.QUEUE_CONNECTION = process.env.sQUEUE_CONNECTION;
    process.env.QUEUE_TENANT_CONNECTION = process.env.sQUEUE_TENANT_CONNECTION;
    connection = await queue.connect();

    await connection.subscribe('test', (message) => {
      console.log(message);
    });
  });

  afterAll(async () => {
    await connection.quit();
  });

  it('Redis connection callback', async () => {
    expect(connection).not.toBeNull();
  });
});
