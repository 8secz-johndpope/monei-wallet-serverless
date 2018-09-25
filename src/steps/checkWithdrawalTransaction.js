import {web3} from '../services/etherium';

import Transaction from '../models/Transaction';

module.exports.handler = async ({transaction, bankAccountId}) => {
  const [currentBlock, receipt] = await Promise.all([
    web3.eth.getBlockNumber(),
    web3.eth.getTransactionReceipt(transaction.id)
  ]);

  // exit if no receipt (transaction is not mined yet) or has less then 10 blocks ahead
  if (!receipt || currentBlock - receipt.blockNumber < 10) {
    return {transaction, bankAccountId};
  }

  // updates dynamoDB record
  const trx = await Transaction.updateFromReceipt(receipt);

  return {transaction: trx, bankAccountId};
};
