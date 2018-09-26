import axios from 'axios';
import qs from 'qs';
import {getSecretValue} from '../services/secrets';

import Cognito from '../services/cognito';

const cognito = new Cognito();

export default async function(event) {
  const amount = (event.arguments.amount / 100).toFixed(2);
  const getCredentials = getSecretValue(process.env.MONEI_CREDENTIALS_KEY);
  const getUser = cognito.getUser(event.identity.claims['phone_number']);
  const [credentials, user] = await Promise.all([getCredentials, getUser]);
  const registrationIds = user.registration_ids;
  const data = {
    authentication: JSON.parse(credentials),
    amount,
    currency: 'EUR',
    paymentType: 'DB',
    customer: {
      merchantCustomerId: user.eth_address,
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
      redirectUrl: process.env.API_ENDPOINT + '/complete_checkout',
      savePaymentDetails: true
    });
    return {checkoutUrl: 'https://payments.monei.net/?' + query};
  } catch (error) {
    if (error.response) return error.response.data;
    return error;
  }
}
