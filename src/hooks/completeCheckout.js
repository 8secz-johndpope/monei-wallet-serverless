const axios = require('axios');
const qs = require('qs');
const {getSecretValue} = require('../services/secrets');
const {redirect} = require('../lib/apiUtils');
const {isSuccessful} = require('../services/monei');
const {withMasterAccount} = require('../services/etherium');

module.exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));
  const credentials = await getSecretValue(process.env.MONEI_CREDENTIALS_KEY);
  const {resourcePath} = event.queryStringParameters;
  const data = {
    authentication: JSON.parse(credentials)
  };
  const options = {
    method: 'GET',
    data: qs.stringify(data, {allowDots: true}),
    url: process.env.MONEI_API_URL + resourcePath
  };

  try {
    const res = await axios(options);
    const {token, masterAddress} = await withMasterAccount();
    console.log(JSON.stringify(res.data, null, 2));
    const success = isSuccessful(res.data);
    return redirect('http://localhost:4000');
  } catch (e) {
    return redirect('http://localhost:4000');
  }
};
