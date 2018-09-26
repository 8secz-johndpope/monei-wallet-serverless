const TransferWise = require('../services/transferwise');
const {getSecretValue} = require('../services/secrets');

/**
 {
  "transaction": {
    "createdAt": 1537956636051,
    "updatedAt": 1537956636051,
    "status": "completed",
    "id": "0x91d34fc00971be420b2522e82edc865abb00a70140d9eb0a222331fddefdb480",
    "from": "0xaA8bdEe6C688c2dA8c3A15397c20CD116e482e73",
    "fromInfo": "0xaA8bdEe6C688c2dA8c3A15397c20CD116e482e73",
    "to": "0x4af669e4f4422c0d867415ab0784005bf989a992",
    "toInfo": "MONEI Coins exchange",
    "amount": 100,
    "note": "Transferred to your bank account. You'll receive funds within 24 hours"
  },
  "bankAccountId": "14181225"
}
 */

const TRANSACTION_FEE = 0.6;

exports.handler = async ({transaction, bankAccountId}) => {
  JSON.stringify({transaction, bankAccountId}, null, 2);

  if (!transaction || !transaction.amount) {
    throw new Error('Invalid transaction');
  }

  if (!bankAccountId) {
    throw new Error('Invalid bank account id');
  }

  const amount = transaction.amount / 100 + TRANSACTION_FEE;
  const creds = await getSecretValue(process.env.TRANSFERWISE_CREDENTIALS_KEY);
  const options = JSON.parse(creds);

  const client = new TransferWise(options);
  const result = await client.transfer({targetAccount: bankAccountId, amount});
  JSON.stringify(result, null, 2);
  return result;
};
