const TransferWise = require('../services/transferwise');
const {getSecretValue} = require('../services/secrets');
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

// creates transferwise account
exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));

  const {accountHolderName, country, IBAN} = event.arguments;
  const creds = await getSecretValue(process.env.TRANSFERWISE_CREDENTIALS_KEY);
  const options = JSON.parse(creds);

  // manually set profile id for now
  options.profile = 256;

  const client = new TransferWise(options);
  const account = await client.createAccount({accountHolderName, country, IBAN});

  console.log(JSON.stringify(account, null, 2));

  // update bank_account_id in cognito for a user
  await cognito
    .adminUpdateUserAttributes({
      UserPoolId: process.env.USER_POOL_ID,
      Username: event.identity.username,
      UserAttributes: [
        {
          Name: 'custom:bank_account_id',
          Value: String(account.id)
        }
      ]
    })
    .promise();

  return {
    id: account.id,
    accountHolderName: account.accountHolderName,
    country: account.country,
    IBAN: account.details.IBAN
  };
};
