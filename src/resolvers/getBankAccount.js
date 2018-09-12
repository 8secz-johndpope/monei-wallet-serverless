const TransferWise = require('../services/transferwise');
const {getSecretValue} = require('../services/secrets');
const Cognito = require('../services/cognito');

const cognito = new Cognito();

// get transferwise account for a user
exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));

  const user = await cognito.getUser(event.identity.username);
  console.log(JSON.stringify(user, null, 2));

  // exit function if no bank account
  if (!user.bank_account_id) return null;

  const creds = await getSecretValue(process.env.TRANSFERWISE_CREDENTIALS_KEY);
  const options = JSON.parse(creds);

  const client = new TransferWise(options);
  return client.getAccount(user.bank_account_id);
};
