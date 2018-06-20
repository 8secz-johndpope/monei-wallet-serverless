const {withMasterAccount} = require('../services/etherium');
const {notifyTrxCreated} = require('../services/userNotifier');
const Transaction = require('../models/Transaction');

// tokens stored in the contract as integers, so amount = value * 10 ** decimals
const FREE_TOKENS_AMOUNT = 200;

/**
 * Grants free tokens to a new address
 * @param account: <{address: String}> - user account containing address
 * @returns {Promise<Object>} - returns a promise with transaction object
 */
module.exports.handler = async account => {
  const {token, masterAddress} = await withMasterAccount();

  // create a transaction to transfer tokens
  const tokenTransaction = token.methods.transfer(account.address, FREE_TOKENS_AMOUNT);

  // estimate transaction gas
  const gasNeeded = await tokenTransaction.estimateGas({
    from: masterAddress,
    gas: 60000
  });

  // send transaction and save it to dynamoDB
  const transaction = await new Promise((resolve, reject) => {
    tokenTransaction.send({from: masterAddress, gas: gasNeeded}, (error, hash) => {
      if (error) return reject(error);
      Transaction.create({
        id: hash,
        from: masterAddress,
        fromInfo: 'MONEI',
        to: account.address,
        amount: FREE_TOKENS_AMOUNT,
        note: 'Free coins to start right away!'
      }).then(resolve, reject);
    });
  });

  // notify recipient about new transaction
  await notifyTrxCreated(transaction);

  return transaction;
};
