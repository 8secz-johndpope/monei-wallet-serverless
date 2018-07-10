const {withMasterAccount} = require('../services/etherium');
const Transaction = require('../models/Transaction');

exports.handler = async ({address, amount, note}) => {
  const {token, masterAddress} = await withMasterAccount();

  // create a transaction to transfer tokens
  const tokenTransaction = token.methods.transfer(address, amount);

  // estimate transaction gas
  const gasNeeded = await tokenTransaction.estimateGas({
    from: masterAddress,
    gas: 60000
  });

  // send transaction and save it to dynamoDB
  return new Promise((resolve, reject) => {
    tokenTransaction.send({from: masterAddress, gas: gasNeeded}, (error, hash) => {
      if (error) return reject(error);
      Transaction.create({
        id: hash,
        from: masterAddress,
        fromInfo: 'MONEI',
        to: address,
        amount,
        note
      }).then(resolve, reject);
    });
  });
};
