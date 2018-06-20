const aws = jest.genMockFromModule('aws-sdk');

let attachPrincipalPolicy = jest.fn();
attachPrincipalPolicy.mockReturnValue({
  promise() {
    return Promise.resolve({});
  }
});

aws.Iot = function() {
  return {
    _attachPrincipalPolicyError: error => {
      attachPrincipalPolicy.mockReturnValue({
        promise() {
          return Promise.reject(error);
        }
      });
    },
    attachPrincipalPolicy
  };
};

module.exports = aws;
