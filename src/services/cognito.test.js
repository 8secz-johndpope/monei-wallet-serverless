import Cognito from './cognito';
import * as fixtures from './fixtures/cognito';

describe('Cognito', () => {
  it('should normalize user data', () => {
    expect(Cognito.normalizeUserData(fixtures.userData)).toEqual(fixtures.userNormalizedData);
  });
});
