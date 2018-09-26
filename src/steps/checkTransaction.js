import {web3} from '../services/etherium';

import Transaction from '../models/Transaction';

export default async function(event) {
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
  return await Transaction.updateFromReceipt(receipt);
}
