module.exports.handler = (data, serverless, options) => {
  console.log(`

===================== FRONT-END CONFIG =====================
Add this to the .env file in the front-end app

REACT_APP_REGION=${options.region}
REACT_APP_IDENTITY_POOL_ID=${data.IdentityPoolId}
REACT_APP_USER_POOL_ID=${data.UserPoolId}
REACT_APP_USER_POOL_CLIENT_ID=${data.UserPoolClientId}
REACT_APP_GRAPHQL_ENDPOINT=${data.GraphQlApiUrl}
REACT_APP_API_ENDPOINT=${data.ServiceEndpoint}

  `);
};
