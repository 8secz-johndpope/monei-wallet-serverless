const AWS = require('aws-sdk');
const iot = new AWS.Iot();

const headers = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
};

/**
 * Attaches iot policy to cognitoIdentityId.
 * AWS requires a policy to be manually attached to each cognitId to receive mqtt messages
 * @param event
 * @returns {Promise<*>}
 */
module.exports.handler = async event => {
  try {
    await iot
      .attachPrincipalPolicy({
        principal: event.requestContext.identity.cognitoIdentityId,
        policyName: process.env.USER_NOTIFICATIONS_POLICY
      })
      .promise();

    return {
      statusCode: 200,
      headers,
      body: 'Policy attached'
    };
  } catch (error) {
    if (error.statusCode === 409) {
      // Policy already exists for this cognito identity
      return {
        statusCode: 200,
        headers,
        body: 'Policy already attached'
      };
    } else {
      return {
        statusCode: error.statusCode || 500,
        headers,
        body: JSON.stringify(error)
      };
    }
  }
};
