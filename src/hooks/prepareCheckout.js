const axios = require('axios');
const qs = require('qs');
const {getSecretValue} = require('../services/secrets');
const {redirect, success, fail} = require('../lib/apiUtils');

module.exports.handler = async event => {
  const body = JSON.parse(event.body);
  const amount = (body.amount / 100).toFixed(2);
  const credentials = await getSecretValue(process.env.MONEI_CREDENTIALS_KEY);
  const data = {
    authentication: JSON.parse(credentials),
    amount,
    currency: 'EUR',
    paymentType: 'DB'
  };
  const options = {
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: qs.stringify(data, {allowDots: true}),
    url: 'https://test.oppwa.com/v1/checkouts'
  };
  try {
    const res = await axios(options);
    const checkoutId = res.data.id;
    const query = qs.stringify({
      checkoutId,
      redirectUrl: process.env.API_ENDPOINT + '/complete_checkout',
      test: true
    });
    return redirect('https://payments.monei.net/?' + query);
  } catch (error) {
    return fail(error.response);
  }
};
