const axios = require('axios');
const qs = require('qs');
const {getSecretValue} = require('../services/secrets');
const {redirect} = require('../lib/apiUtils');
const {isSuccessful} = require('../services/monei');
const AWS = require('aws-sdk');
const transferTokens = require('../steps/transferTokens').handler;

const stepFunctions = new AWS.StepFunctions();

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
    console.log(JSON.stringify(res.data, null, 2));
    const success = isSuccessful(res.data);
    const address = res.data.customer.merchantCustomerId;
    const amount = Number.parseFloat(res.data.amount) * 100;
    if (success) {
      const trx = await transferTokens({address, amount, note: 'Coins exchanged for EUR'});

      console.log(JSON.stringify(trx, null, 2));
      // start a CheckTransactionSM state machine to check transaction status
      await stepFunctions
        .startExecution({
          stateMachineArn: process.env.CHECK_TRANSACTIN_SM,
          input: JSON.stringify(trx)
        })
        .promise();
    }
    return redirect(process.env.FONTEND_URL);
  } catch (e) {
    console.log(e);
    return redirect(process.env.FONTEND_URL);
  }
};
