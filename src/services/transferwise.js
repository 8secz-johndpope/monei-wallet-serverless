const axios = require('axios');
const qs = require('qs');

const responseHandler = response => response.data;

const errorHandler = error => {
  if (error) {
    if (error.response) return Promise.reject(error.response.data);
    return Promise.reject(error.message);
  }
};

axios.interceptors.response.use(responseHandler, errorHandler);

class TransferWise {
  constructor(props) {
    this.refreshToken = props.refreshToken;
    this.clientId = props.clientId;
    this.clientSecret = props.clientSecret;
    this.profile = props.profile;
    this.apiClient = axios.create({
      baseURL: process.env.TRANSFERWISE_API_URL
    });
    this.apiClient.interceptors.response.use(responseHandler, errorHandler);
    this.apiClient.interceptors.request.use(
      this.requestHandler.bind(this),
      TransferWise.errorHandler
    );
  }

  async requestHandler(config) {
    const token = await this.getAccessToken();
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  }

  async getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }
    const options = {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      baseURL: process.env.TRANSFERWISE_API_URL,
      url: '/oauth/token',
      auth: {
        username: this.clientId,
        password: this.clientSecret
      },
      data: qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    };
    const result = await axios(options);
    this.accessToken = result.access_token;
    return this.accessToken;
  }

  async createAccount(data) {
    const account = {
      profile: this.profile,
      accountHolderName: data.accountHolderName,
      country: data.country,
      currency: 'EUR',
      type: 'iban',
      details: {
        legalType: 'PRIVATE',
        IBAN: data.IBAN
      }
    };
    return this.apiClient.post('/v1/accounts', account);
  }

  async getAccount(accountId) {
    return this.apiClient.get(`/v1/accounts/${accountId}`);
  }

  async deleteAccount(accountId) {
    await this.apiClient.delete(`/v1/accounts/${accountId}`);
    return {success: true};
  }
}

module.exports = TransferWise;
