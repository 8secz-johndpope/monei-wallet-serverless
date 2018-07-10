const {withMasterAccount} = require('../services/etherium');
const Transaction = require('../models/Transaction');
const {normalizeUser} = require('../lib/cognitoUtils');
const AWS = require('aws-sdk');

const stepFunctions = new AWS.StepFunctions();
const cognito = new AWS.CognitoIdentityServiceProvider();

// creates new transaction for a user
exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));
  const addressFrom = event.identity.claims['custom:eth_address'];
  const amount = event.arguments.amount;
  const note = event.arguments.note;

  let addressTo = event.arguments.ethAddress;
  let fromInfo = addressFrom;
  let toInfo = addressTo;

  if (!addressTo) {
    // search user by phone number if provided
    if (event.arguments.phoneNumber) {
      const {Users} = await cognito
        .listUsers({
          UserPoolId: process.env.USER_POOL_ID,
          Filter: `phone_number = "${event.arguments.phoneNumber}"`,
          Limit: 0
        })
        .promise();

      if (Users.length === 0) throw new Error('No user found with this phone number');

      // grab the first user in the result
      const user = normalizeUser(Users[0]);

      // as user transfers tokens by phone number we set fromInfo to his phone number
      // and toInfo to recipient phone number
      fromInfo = event.identity.claims.phone_number;
      toInfo = user.phone_number;

      addressTo = user['custom:eth_address'];
    }

    // search user by email if provided
    else if (event.arguments.email) {
      const {Users} = await cognito
        .listUsers({
          UserPoolId: process.env.USER_POOL_ID,
          Filter: `email = "${event.arguments.email}"`,
          Limit: 0
        })
        .promise();

      if (Users.length === 0) throw new Error('No user found with this email');

      // grab the first user in the result
      const user = normalizeUser(Users[0]);

      // as user transfers tokens by email we set fromInfo to his email
      // and toInfo to recipient email
      fromInfo = event.identity.claims.email;
      toInfo = user.email;

      addressTo = user['custom:eth_address'];
    } else {
      throw new Error('Please provide user phone number, email or address');
    }
  }

  // initialize web3 with master credentials from mnemonic
  const {web3, token} = await withMasterAccount();

  const [balance, allowance] = await Promise.all([
    token.methods.balanceOf(addressFrom).call(),
    token.methods.allowance(addressFrom, web3.eth.defaultAccount).call()
  ]);

  // do not continue if balance is less than transferring amount
  if (amount > balance) {
    throw new Error('Insufficient funds');
  }
  if (addressTo.toLowerCase() === addressFrom.toLowerCase()) {
    throw new Error("You can't send funds to yourself");
  }

  // do not continue if master account is not allowed to send tokens
  if (amount > allowance) {
    throw new Error('You are not allowed to make transfers');
  }

  // create a transaction to transfer tokens
  const tokenTransaction = token.methods.transferFrom(addressFrom, addressTo, amount);

  // estimate transaction gas
  const gasNeeded = await tokenTransaction.estimateGas({
    from: web3.eth.defaultAccount,
    gas: 60000
  });

  // send transaction and save it to dynamoDB
  const trx = await new Promise((resolve, reject) => {
    tokenTransaction.send({from: web3.eth.defaultAccount, gas: gasNeeded}, (error, hash) => {
      if (error) reject(error);
      Transaction.create({
        id: hash,
        from: addressFrom,
        to: addressTo,
        fromInfo,
        toInfo,
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
