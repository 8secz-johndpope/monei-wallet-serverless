const authy = require('authy')(process.env.AUTHY_API_KEY);
const {PhoneNumberUtil} = require('google-libphonenumber');

const phoneUtil = PhoneNumberUtil.getInstance();

exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2));

  // skip challenge if user has active session
  if (event.request.session && event.request.session.length > 0) return callback(null, event);

  const phoneNumber = phoneUtil.parse(event.request.userAttributes.phone_number);
  const nationalNumber = phoneNumber.getNationalNumber();
  const countryCode = phoneNumber.getCountryCode();

  // pass formatted phone to the verifyAuthChallenge hook
  event.response.privateChallengeParameters = {
    nationalNumber,
    countryCode
  };

  event.response.challengeMetadata = 'PHONE_VERIFICATION_CHALLENGE';

  authy.phones().verification_start(nationalNumber, countryCode, 'sms', (err, res) => {
    if (err) return callback(err.message);
    if (res.success) return callback(null, event);
    return callback('Something went wrong.');
  });
};
