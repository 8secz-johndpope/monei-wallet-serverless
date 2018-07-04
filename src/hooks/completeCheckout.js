const axios = require('axios');
const qs = require('qs');
const {getSecretValue} = require('../services/secrets');
const {redirect, fail} = require('../lib/apiUtils');
const {isSuccessful, getDescription} = require('../services/monei');
const {withMasterAccount, masterAddress} = require('../services/etherium');
const Transaction = require('../models/Transaction');
const AWS = require('aws-sdk');
const uniqid = require('uniqid');

const stepFunctions = new AWS.StepFunctions();

const transferTokens = async ({address, amount, note}) => {
  const {token} = await withMasterAccount();

  // create a transaction to transfer tokens
  const tokenTransaction = token.methods.transfer(address, amount);

  // estimate transaction gas
  const gasNeeded = await tokenTransaction.estimateGas({
    from: masterAddress,
    gas: 60000
  });

  // send transaction and save it to dynamoDB
  const trx = await new Promise((resolve, reject) => {
    tokenTransaction.send({from: masterAddress, gas: gasNeeded}, (error, hash) => {
      if (error) return reject(error);
      Transaction.create({
        id: hash,
        from: masterAddress,
        fromInfo: 'MONEI Coins exchange',
        to: address,
        amount,
        note
      }).then(resolve, reject);
    });
  });

  // start a CheckTransactionSM state machine to check transaction status
  await stepFunctions
    .startExecution({
      stateMachineArn: process.env.CHECK_TRANSACTIN_SM,
      input: JSON.stringify(trx)
    })
    .promise();

  return trx;
};

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

    const address = res.data.customer.merchantCustomerId;
    const amount = Number.parseFloat(res.data.amount || 0) * 100;
    const note = getDescription(res.data);

    if (isSuccessful(res.data)) {
      await transferTokens({address, amount, note});
    } else {
      await Transaction.create({
        id: uniqid(),
        status: 'failed',
        from: masterAddress,
        fromInfo: 'MONEI Coins exchange',
        to: address,
        amount,
        note
      });
    }

    return redirect(process.env.FONTEND_URL);
  } catch (error) {
    if (error.response) {
      return fail({
        statusCode: error.response.status,
        ...error.response.data
      });
    }
    console.log(JSON.stringify(error, null, 2));
    return fail(error);
  }
};
