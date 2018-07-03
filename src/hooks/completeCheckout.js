const axios = require('axios');
const qs = require('qs');
const {getSecretValue} = require('../services/secrets');
const {redirect} = require('../lib/apiUtils');
const {isSuccessful} = require('../services/monei');
const AWS = require('aws-sdk');

const stepFunctions = new AWS.StepFunctions();

module.exports.handler = async event => {
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
    console.log(JSON.stringify(res.data, null, 2));
    const address = res.data.customer.merchantCustomerId;
    const amount = Number.parseFloat(res.data.amount) * 100;

    if (isSuccessful(res.data)) {
      // start transfer tokens state machine
      await stepFunctions
        .startExecution({
          stateMachineArn: process.env.TRANSFER_TOKENS_SM,
          input: JSON.stringify({
            address,
            amount,
            note: 'Coins exchanged for EUR'
          })
        })
        .promise();
    }
    return redirect('http://localhost:4000');
  } catch (e) {
    return redirect('http://localhost:4000');
  }
};
