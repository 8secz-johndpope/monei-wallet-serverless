import AWS from 'aws-sdk';
import {fail, success} from '../lib/apiUtils';

const iot = new AWS.Iot();

/**
 * Attaches iot policy to cognitoIdentityId.
 * AWS requires a policy to be manually attached to each cognitId to receive mqtt messages
 * @param event
 * @returns {Promise<*>}
 */
export default async function(event) {
  try {
    await iot
      .attachPrincipalPolicy({
        principal: event.requestContext.identity.cognitoIdentityId,
        policyName: process.env.USER_NOTIFICATIONS_POLICY
      })
      .promise();
    return success({message: 'Policy attached'});
  } catch (error) {
    if (error.statusCode === 409) {
      // Policy already exists for this cognito identity
      return success({message: 'Policy already attached'});
    } else {
      return fail(error);
    }
  }
}
