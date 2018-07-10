const AWS = require('aws-sdk');
const PasswordGenerator = require('strict-password-generator').default;

const provider = new AWS.CognitoIdentityServiceProvider();
const passwordGenerator = new PasswordGenerator();

exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));

  const params = {
    ClientId: process.env.USER_POOL_CLIENT_ID,
    Password: passwordGenerator.generatePassword(),
    Username: event.body.username
  };
  return provider.signUp(params).promise();
};
