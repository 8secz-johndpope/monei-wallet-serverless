const AWS = require('aws-sdk');
const {parseBoolean} = require('../lib/utils');

const cognito = new AWS.CognitoIdentityServiceProvider();

const STANDART_ATTRIBUTES = [
  'address',
  'birthdate',
  'email',
  'family_name',
  'gender',
  'given_name',
  'locale',
  'middle_name',
  'name',
  'nickname',
  'phone_number',
  'picture',
  'preferred_username',
  'profile',
  'timezone',
  'updated_at',
  'website'
];

class Cognito {
  constructor(config = {}) {
    this.userPoolId = config.userPoolId || process.env.USER_POOL_ID;
  }

  static normalizeUserData(user) {
    const result = {
      status: user.UserStatus,
      enabled: user.Enabled
    };
    const attributes = user.UserAttributes || user.Attributes;
    attributes.forEach(({Name, Value}) => {
      result[Name.replace('custom:', '')] = parseBoolean(Value);
    });
    return result;
  }

  static mapUserAttributes(data) {
    return Object.keys(data).map(key => ({
      Name: STANDART_ATTRIBUTES.includes(key) ? key : `custom:${key}`,
      Value: String(data[key])
    }));
  }

  async getUser(username) {
    const params = {
      UserPoolId: this.userPoolId,
      Username: username
    };
    const data = await cognito.adminGetUser(params).promise();
    return Cognito.normalizeUserData(data);
  }

  async updateUser(username, data) {
    return cognito
      .adminUpdateUserAttributes({
        UserPoolId: this.userPoolId,
        Username: username,
        UserAttributes: Cognito.mapUserAttributes(data)
      })
      .promise();
  }
}

module.exports = Cognito;
