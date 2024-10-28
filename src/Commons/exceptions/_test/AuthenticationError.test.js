const AuthenticationError = require('../AuthenticationError');

describe('An AuthenticationError', () => {
  it('should create an error correctly', () => {
    const authenticationError = new AuthenticationError('authentication error!');

    expect(authenticationError.name).toEqual('AuthenticationError');
    expect(authenticationError.statusCode).toEqual(401);
    expect(authenticationError.message).toEqual('authentication error!');
  });
});
