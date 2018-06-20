const AWS = require('aws-sdk');
const attachUserPolicy = require('./attachUserPolicy').handler;

jest.mock('aws-sdk');

const iot = new AWS.Iot();
process.env.USER_NOTIFICATIONS_POLICY = 'USER_NOTIFICATIONS_POLICY';

const mockEvent = {
  requestContext: {
    identity: {
      cognitoIdentityId: '12345'
    }
  }
};

const requiredHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};

describe('attachUserPolicy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully attach user policy', async () => {
    const result = await attachUserPolicy(mockEvent);
    expect(iot.attachPrincipalPolicy).toHaveBeenCalledWith({
      principal: '12345',
      policyName: 'USER_NOTIFICATIONS_POLICY'
    });
    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual(requiredHeaders);
    expect(result.body).toBe('Policy attached');
  });

  it('should return success if policy already attached', async () => {
    iot._attachPrincipalPolicyError({statusCode: 409});
    const result = await attachUserPolicy(mockEvent);
    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual(requiredHeaders);
    expect(result.body).toBe('Policy already attached');
  });

  it('should return error if attachPrincipalPolicy fails', async () => {
    const error = {message: 'Something went wrong'};
    iot._attachPrincipalPolicyError(error);
    const result = await attachUserPolicy(mockEvent);
    expect(result.statusCode).toBe(500);
    expect(result.headers).toEqual(requiredHeaders);
    expect(result.body).toBe(JSON.stringify(error));
  });
});
