const TransferWise = require('../services/transferwise');
const {getSecretValue} = require('../services/secrets');
const Cognito = require('../services/cognito');

const cognito = new Cognito();

/**
{
  "transaction": {
    "createdAt": 1537956636051,
    "updatedAt": 1537956636051,
    "status": "pending",
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

exports.handler = async data => {
  JSON.stringify(data, null, 2);

  try {
    const amount = data.amount / 100;
    const creds = await getSecretValue(process.env.TRANSFERWISE_CREDENTIALS_KEY);
    const options = JSON.parse(creds);

    const client = new TransferWise(options);
  } catch (error) {}
};
