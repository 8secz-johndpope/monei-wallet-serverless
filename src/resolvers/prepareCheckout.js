const axios = require('axios');
const AWS = require('aws-sdk');
const qs = require('qs');
const {getSecretValue} = require('../services/secrets');
const {normalizeUser} = require('../lib/cognitoUtils');

const cognito = new AWS.CognitoIdentityServiceProvider();

const getCognitoUser = async username => {
  const params = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: username
  };
  const data = await cognito.adminGetUser(params).promise();
  return normalizeUser(data);
};

exports.handler = async event => {
  const amount = (event.arguments.amount / 100).toFixed(2);
  const getCredentials = getSecretValue(process.env.MONEI_CREDENTIALS_KEY);
  const getUser = getCognitoUser(event.identity.claims['phone_number']);
  const [credentials, user] = await Promise.all([getCredentials, getUser]);
  const registrationIds = user['custom:registration_ids'];
  const data = {
    authentication: JSON.parse(credentials),
    amount,
    currency: 'EUR',
    paymentType: 'DB',
    createRegistration: true,
    customer: {
      merchantCustomerId: user['custom:eth_address'],
      phone: user.phone_number
    }
  };
  if (registrationIds) {
    data.registrations = registrationIds.split(',').map(id => ({id}));
  }
  const options = {
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: qs.stringify(data, {allowDots: true}),
    url: process.env.MONEI_API_URL + '/v1/checkouts'
  };

  try {
    const res = await axios(options);
    const checkoutId = res.data.id;
    const query = qs.stringify({
      checkoutId,
      redirectUrl: process.env.API_ENDPOINT + '/complete_checkout'
    });
    return {checkoutUrl: 'https://payments.monei.net/?' + query};
  } catch (error) {
    if (error.response) return error.response.data;
    return error;
  }
};
