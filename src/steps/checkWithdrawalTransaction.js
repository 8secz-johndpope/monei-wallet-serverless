const {web3} = require('../services/etherium');
const Transaction = require('../models/Transaction');

exports.handler = async ({transaction, bankAccountId, confirmations = 0}) => {
  const [currentBlock, receipt] = await Promise.all([
    web3.eth.getBlockNumber(),
    web3.eth.getTransactionReceipt(transaction.id)
  ]);

  // exit if no receipt (transaction is not mined yet)
  if (!receipt) {
    return {transaction, bankAccountId, confirmations};
  }

  // update transaction if receipt exists and transaction status is pending
  if (transaction.status === 'pending') {
    transaction = await Transaction.updateFromReceipt(receipt);
  }

  // update confirmations counter
  confirmations = currentBlock - receipt.blockNumber;

  return {transaction, bankAccountId, confirmations};
};
