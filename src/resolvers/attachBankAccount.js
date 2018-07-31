const TransferWise = require('../services/transferwise');
const {getSecretValue} = require('../services/secrets');

// creates transferwise account
exports.handler = async event => {
  const {accountHolderName, country, IBAN} = event.arguments;
  const creds = await getSecretValue(process.env.TRANSFERWISE_CREDENTIALS_KEY);
  const options = JSON.parse(creds);
  options.profile = 256;
  const client = new TransferWise(options);
  return client.createAccount({accountHolderName, country, IBAN});
};
