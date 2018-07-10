const authy = require('authy')(process.env.AUTHY_API_KEY);

module.exports.handler = (event, context, callback) => {
  const {nationalNumber, countryCode} = event.request.privateChallengeParameters;

  authy
    .phones()
    .verification_check(nationalNumber, countryCode, event.request.challengeAnswer, (err, res) => {
      if (err) return callback(err.message);
      event.response.answerCorrect = res.success;
      return callback(null, event);
    });

  return event;
};
