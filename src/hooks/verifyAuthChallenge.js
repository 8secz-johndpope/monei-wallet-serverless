const authy = require('authy')(process.env.AUTHY_API_KEY);
const {promisify} = require('es6-promisify');
const AWS = require('aws-sdk');

const provider = new AWS.CognitoIdentityServiceProvider();
const verificationCheck = promisify(authy.phones().verification_check);

exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));

  const {nationalNumber, countryCode} = event.request.privateChallengeParameters;
  const phoneVerified = event.request.userAttributes.phone_number_verified === 'true';
  const challengeAnswer = event.request.challengeAnswer;

  try {
    const res = await verificationCheck(nationalNumber, countryCode, challengeAnswer);

    // return event directly if verification is not successful
    if (!res.success) {
      return event;
    }

    event.response.answerCorrect = true;

    // return successful check if phone is already verified
    if (phoneVerified) {
      return event;
    }

    // set user phone_number_verified attr to true
    await provider
      .adminUpdateUserAttributes({
        UserAttributes: [{Name: 'phone_number_verified', Value: 'true'}],
        UserPoolId: event.userPoolId,
        Username: event.userName
      })
      .promise();

    return event;
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    event.response.answerCorrect = false;
    return event;
  }
};
