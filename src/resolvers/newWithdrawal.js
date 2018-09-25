const {withMasterAccount} = require('../services/etherium');
const Transaction = require('../models/Transaction');
const AWS = require('aws-sdk');

const stepFunctions = new AWS.StepFunctions();

// creates new transaction for a user
exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));
  const addressFrom = event.identity.claims['custom:eth_address'];
  const amount = event.arguments.amount;

  // initialize web3 with master credentials from mnemonic
  const {web3, token, masterAddress} = await withMasterAccount();
  let fromInfo = addressFrom;

  const [balance, allowance] = await Promise.all([
    token.methods.balanceOf(addressFrom).call(),
    token.methods.allowance(addressFrom, web3.eth.defaultAccount).call()
  ]);

  // do not continue if balance is less than transferring amount
  if (amount > balance) {
    throw new Error('Insufficient funds');
  }

  // do not continue if master account is not allowed to send tokens
  if (amount > allowance) {
    throw new Error('You are not allowed to make withdrawals');
  }

  // create a transaction to transfer tokens
  const tokenTransaction = token.methods.transferFrom(addressFrom, masterAddress, amount);

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
        fromInfo,
        to: masterAddress,
        toInfo: 'MONEI Coins exchange',
        amount,
        note: "Transferred to your bank account. You'll receive funds within 24 hours"
      }).then(resolve, reject);
    });
  });

  // start a WithdrawTokensSM state machine to check transaction status and transfer fiat
  await stepFunctions
    .startExecution({
      stateMachineArn: process.env.WITHDRAW_TOKENS_SM,
      input: JSON.stringify(trx)
    })
    .promise();

  return trx;
};
