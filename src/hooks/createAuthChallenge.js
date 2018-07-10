const authy = require('authy')(process.env.AUTHY_API_KEY);
const {PhoneNumberUtil} = require('google-libphonenumber');
const {promisify} = require('es6-promisify');

const phoneUtil = PhoneNumberUtil.getInstance();
const verificationStart = promisify(authy.phones().verification_start);

exports.handler = async event => {
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

  try {
    const res = await verificationStart(nationalNumber, countryCode, 'sms');
    if (res.success) return event;
    return res.message;
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return error.message || 'Something went wrong';
  }
};
