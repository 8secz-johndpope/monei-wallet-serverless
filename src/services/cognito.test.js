const Cognito = require('./cognito');
const fixtures = require('./fixtures/cognito');

describe('Cognito', () => {
  it('should normalize user data', () => {
    expect(Cognito.normalizeUserData(fixtures.userData)).toEqual(fixtures.userNormalizedData);
  });
});
