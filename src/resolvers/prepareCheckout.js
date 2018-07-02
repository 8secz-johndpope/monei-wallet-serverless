const axios = require('axios');
const qs = require('qs');
const {getSecretValue} = require('../services/secrets');

module.exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));
  const amount = (event.arguments.amount / 100).toFixed(2);
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
  const res = await axios(options);
  const checkoutId = res.data.id;
  const query = qs.stringify({
    checkoutId,
    redirectUrl: process.env.API_ENDPOINT + '/complete_checkout',
    test: true
  });
  return {checkoutUrl: 'https://payments.monei.net/?' + query};
};
