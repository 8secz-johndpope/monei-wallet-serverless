const TransferWise = require('../services/transferwise');
const {getSecretValue} = require('../services/secrets');
const Cognito = require('../services/cognito');

const cognito = new Cognito();

exports.handler = async data => {
  JSON.stringify(data, null, 2);

  try {
    const amount = data.amount / 100;
    const creds = await getSecretValue(process.env.TRANSFERWISE_CREDENTIALS_KEY);
    const options = JSON.parse(creds);

    const client = new TransferWise(options);
  } catch (error) {}
};
