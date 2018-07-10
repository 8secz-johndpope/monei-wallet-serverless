exports.handler = (event, context, callback) => {
  // Automatically confirm all users
  event.response.autoConfirmUser = true;

  // Return to Amazon Cognito
  callback(null, event);
};
