const TransferWise = require('../services/transferwise');
const {getSecretValue} = require('../services/secrets');
const Cognito = require('../services/cognito');

const cognito = new Cognito();

// deletes transferwise account
exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));

  try {
    const user = await cognito.getUser(event.identity.username);
    console.log(JSON.stringify(user, null, 2));

    // exit function if no bank account
    if (!user.bank_account_id) return {success: true};

    const creds = await getSecretValue(process.env.TRANSFERWISE_CREDENTIALS_KEY);
    const options = JSON.parse(creds);

    const client = new TransferWise(options);

    // delete transferwise account
    await client.deleteAccount(user.bank_account_id);

    // remove bank_account_id attr from cognito user
    await cognito.updateUser(event.identity.username, {bank_account_id: ''});
    return {success: true};
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return error;
  }
};
