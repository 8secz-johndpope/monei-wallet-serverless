const TransferWise = require('./transferwise');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const fixtures = require('./fixtures/transferwise');

const options = {
  clientId: 'moeni',
  clientSecret: 'fe4ef6ab-ee45-4a71-a2e3-7397dc7d6480',
  profile: 123
};

const client = new TransferWise(options);
const mockAxios = new MockAdapter(axios);
const mockApiClient = new MockAdapter(client.apiClient);

mockAxios.onPost('/oauth/token').reply(config => {
  if (config.auth.username === options.clientId && config.auth.password === options.clientSecret) {
    return [200, fixtures.getAccessTokenRes];
  }
  return [404, fixtures.getAccessTokenError];
});

mockApiClient.onPost('/v1/accounts').reply(config => {
  if (config.headers.Authorization === 'Bearer ' + fixtures.getAccessTokenRes.access_token) {
    return [200, fixtures.createAccountRes];
  }
  return [404, fixtures.getAccessTokenError];
});

mockApiClient.onGet('/v1/accounts/' + fixtures.createAccountRes.id).reply(config => {
  if (config.headers.Authorization === 'Bearer ' + fixtures.getAccessTokenRes.access_token) {
    return [200, fixtures.createAccountRes];
  }
  return [404, fixtures.getAccessTokenError];
});

mockApiClient.onDelete('/v1/accounts/' + fixtures.createAccountRes.id).reply(config => {
  if (config.headers.Authorization === 'Bearer ' + fixtures.getAccessTokenRes.access_token) {
    return [200, {}];
  }
  return [404, fixtures.getAccessTokenError];
});

describe('TransferWise', () => {
  it('should get accessToken', async () => {
    const accessToken = await client.getAccessToken();
    expect(accessToken).toBe(fixtures.getAccessTokenRes.access_token);
  });

  it('should create account', async () => {
    const account = await client.createAccount(fixtures.createAccountReq);
    expect(account).toEqual(fixtures.createAccountRes);
  });

  it('should get account', async () => {
    const account = await client.getAccount(fixtures.createAccountRes.id);
    expect(account).toEqual(fixtures.createAccountRes);
  });

  it('should delete account', async () => {
    const account = await client.deleteAccount(fixtures.createAccountRes.id);
    expect(account).toEqual({success: true});
  });
});
