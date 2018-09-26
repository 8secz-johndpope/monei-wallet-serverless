const AWS = require('aws-sdk');
const PasswordGenerator = require('strict-password-generator').default;
const {success, fail} = require('../lib/apiUtils');

const cognito = new AWS.CognitoIdentityServiceProvider();
const passwordGenerator = new PasswordGenerator();

exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));
  const {username, name} = JSON.parse(event.body);

  const params = {
    ClientId: process.env.USER_POOL_CLIENT_ID,
    Password: passwordGenerator.generatePassword(),
    Username: username,
    UserAttributes: [
      {
        Name: 'name',
        Value: name
      }
    ]
  };

  try {
    const user = await cognito.signUp(params).promise();
    return success(user);
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return fail(error);
  }
};
