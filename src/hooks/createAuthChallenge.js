module.exports.handler = async event => {
  if (!event.request.session || event.request.session.length === 0) {
    event.response.publicChallengeParameters = {
      captchaUrl: 'url/123.jpg'
    };
    event.response.privateChallengeParameters = {
      answer: '5'
    };
    event.response.challengeMetadata = 'CAPTCHA_CHALLENGE';
  }
  return event;
};
