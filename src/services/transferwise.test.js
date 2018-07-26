const TransferWise = require('./transferwise');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const config = {
  clientId: 'moeni',
  clientSecret: 'fe4ef6ab-ee45-4a71-a2e3-7397dc7d6480',
  refreshToken: 'ade74961-bd2d-4173-a254-6eaffff98754',
  profile: 123
};

const client = new TransferWise(config);
const mock = new MockAdapter(axios);

const authData = {
  access_token: '4c0f5eaa-14e1-4019-9013-dfe9a5496f36',
  token_type: 'bearer',
  refresh_token: 'b90eddbb-d1e5-4e99-9bc7-c7994620bccb',
  expires_in: 43199,
  scope: 'transfers'
};

mock.onPost('/oauth/token').reply(200, authData);

describe('TransferWise', () => {
  it('should get accessToken', async () => {
    const accessToken = await client.getAccessToken();
    expect(accessToken).toBe(authData.access_token);
  });
});
