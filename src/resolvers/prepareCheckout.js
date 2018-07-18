const axios = require('axios');
const qs = require('qs');
const {getSecretValue} = require('../services/secrets');

exports.handler = async event => {
  const amount = (event.arguments.amount / 100).toFixed(2);
  const credentials = await getSecretValue(process.env.MONEI_CREDENTIALS_KEY);
  const data = {
    authentication: JSON.parse(credentials),
    amount,
    currency: 'EUR',
    paymentType: 'DB',
    createRegistration: true,
    customer: {
      merchantCustomerId: event.identity.claims['custom:eth_address'],
      phone: event.identity.claims['phone_number']
    }
  };
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
