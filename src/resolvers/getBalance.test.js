const getBalance = require('./getBalance').handler;

jest.mock('../services/etherium');

test('getBalance success', async () => {
  const event = {
    body: JSON.stringify({}),
    requestContext: {
      authorizer: {
        principalId: '1',
        address: 'address'
      }
    }
  };
  require('../services/etherium')._balanceShouldReturnError(false);
  const response = await getBalance(event);
  expect(response.statusCode).toEqual(200);
  expect(response.body).toEqual(JSON.stringify({balance: 100}));
});

test("should handle error when getting user's balance", async () => {
  const event = {
    body: JSON.stringify({}),
    requestContext: {
      authorizer: {
        principalId: '1',
        address: 'address'
      }
    }
  };
  require('../services/etherium')._balanceShouldReturnError(true);
  const response = await getBalance(event);
  expect(response.statusCode).toEqual(500);
  expect(response.body).toEqual(JSON.stringify({}));
});
