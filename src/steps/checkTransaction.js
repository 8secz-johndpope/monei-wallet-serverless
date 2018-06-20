const {web3} = require('../services/etherium');
const Transaction = require('../models/Transaction');
const {notifyTrxUpdated} = require('../services/userNotifier');

module.exports.handler = async event => {
  // checks transaction receipt form the blockchain
  const receipt = await web3.eth.getTransactionReceipt(event.id);

  // exit if no receipt (transaction is not mined yet)
  if (!receipt) {
    return {
      id: event.id,
      status: 'pending'
    };
  }

  // updates dynamoDB record
  const trx = await Transaction.updateFromReceipt(receipt);

  // notifies users about transaction update
  await notifyTrxUpdated(trx);

  return trx;
};
