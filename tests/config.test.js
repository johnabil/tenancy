const {config} = require('../index')

test('Config utilities test', () => {
  config.setConfig({
    'test_value': 'test',
  });

  expect(config.getConfig()?.test_value).toBe('test');
});
