const AWS = require('aws-sdk');
const PasswordGenerator = require('strict-password-generator').default;
const {success, fail} = require('../lib/apiUtils');

const provider = new AWS.CognitoIdentityServiceProvider();
const passwordGenerator = new PasswordGenerator();

exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));
  const {username} = JSON.parse(event.body);

  const params = {
    ClientId: process.env.USER_POOL_CLIENT_ID,
    Password: passwordGenerator.generatePassword(),
    Username: username
  };

  try {
    const user = await provider.signUp(params).promise();
    console.log(JSON.stringify(user, null, 2));
    return success(user);
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return fail(error);
  }
};
