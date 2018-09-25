import authy0 from 'authy';
import {promisify} from 'es6-promisify';
import AWS from 'aws-sdk';

const authy = authy0(process.env.AUTHY_API_KEY);
const provider = new AWS.CognitoIdentityServiceProvider();
const stepFunctions = new AWS.StepFunctions();
const verificationCheck = promisify(authy.phones().verification_check);

// tokens stored in the contract as integers, so amount = value * 10 ** decimals
const FREE_TOKENS_AMOUNT = 200;

module.exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));

  const user = event.request.userAttributes;
  const phoneVerified = user.phone_number_verified === 'true';
  const {nationalNumber, countryCode} = event.request.privateChallengeParameters;
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
    const setPhoneVerified = await provider
      .adminUpdateUserAttributes({
        UserAttributes: [{Name: 'phone_number_verified', Value: 'true'}],
        UserPoolId: event.userPoolId,
        Username: event.userName
      })
      .promise();

    const tasks = [setPhoneVerified];

    if (user['custom:eth_address']) {
      // start transfer tokens state machine to grant free tokens
      // to a user who had verified his phone
      const grantFreeTokens = stepFunctions
        .startExecution({
          stateMachineArn: process.env.TRANSFER_TOKENS_SM,
          input: JSON.stringify({
            address: user['custom:eth_address'],
            amount: FREE_TOKENS_AMOUNT,
            note: 'Free coins to start right away!'
          })
        })
        .promise();

      tasks.push(grantFreeTokens);
    }

    await Promise.all(tasks);

    return event;
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    event.response.answerCorrect = false;
    return event;
  }
};
