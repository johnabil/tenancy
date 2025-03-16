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

describe('Queue connection', () => {
  config.setConfig({
    'connection': 'tenant',
  });

  const connectionUrl = queue.getConnectionUrl();
  const channelQueue = 'test';
  let connection;
  let channel;

  beforeAll(async () => {
    connection = await queue.connect(connectionUrl);
    channel = await connection.createChannel();

    await channel.assertQueue(channelQueue, {
      durable: true
    });
  });

  afterAll(async () => {
    await channel.close();
    await connection.close();
  });

  it('Queue connection callback', async () => {
    expect(connection).not.toBeNull();
    expect(channel).not.toBeNull();
  });
});
