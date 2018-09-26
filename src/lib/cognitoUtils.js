/**
 *
 * @param user - cognito user
 * {
 *     "Username": "0e9ddbee-82d8-49a2-bdb8-aaff0d854596",
 *     "Attributes": [
 *         {
 *             "Name": "sub",
 *             "Value": "0e9ddbee-82d8-49a2-bdb8-aaff0d854596"
 *         },
 *         {
 *             "Name": "phone_number_verified",
 *             "Value": "false"
 *         },
 *         {
 *             "Name": "phone_number",
 *             "Value": "+5535999516658"
 *         },
 *         {
 *             "Name": "custom:eth_secret_key",
 *             "Value": "..."
 *         },
 *         {
 *             "Name": "custom:eth_address",
 *             "Value": "0xDCE4180a1dE57397e477158DE2889E5cE6DEEb89"
 *         }
 *     ],
 *     "UserCreateDate": "2018-06-14T14:49:57.919Z",
 *     "UserLastModifiedDate": "2018-06-15T09:15:16.776Z",
 *     "Enabled": true,
 *     "UserStatus": "CONFIRMED"
 * }
 */
exports.normalizeUser = user => {
  const result = {
    status: user.UserStatus,
    enabled: user.Enabled
  };
  const attributes = user.UserAttributes || user.Attributes;
  attributes.forEach(({Name, Value}) => {
    result[Name] = Value;
  });
  return result;
};
