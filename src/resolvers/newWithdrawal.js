import {withMasterAccount} from '../services/etherium';

import Transaction from '../models/Transaction';
import AWS from 'aws-sdk';
import Cognito from '../services/cognito';

const cognito = new Cognito();
const stepFunctions = new AWS.StepFunctions();

// creates new transaction for a user
export default async function(event) {
  console.log(JSON.stringify(event, null, 2));
  const amount = event.arguments.amount;

  const user = await cognito.getUser(event.identity.username);
  console.log(JSON.stringify(user, null, 2));

  if (!user.bank_account_id) {
    throw new Error('No attached bank account');
  }

  // initialize web3 with master credentials from mnemonic
  const {web3, token, masterAddress} = await withMasterAccount();

  const [balance, allowance] = await Promise.all([
    token.methods.balanceOf(user.eth_address).call(),
    token.methods.allowance(user.eth_address, web3.eth.defaultAccount).call()
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
  const tokenTransaction = token.methods.transferFrom(user.eth_address, masterAddress, amount);

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
        from: user.eth_address,
        fromInfo: user.eth_address,
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
      input: JSON.stringify({
        transaction: trx,
        bankAccountId: user.bank_account_id
      })
    })
    .promise();

  return trx;
}
