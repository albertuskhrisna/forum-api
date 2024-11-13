const IAuthenticationTokenManager = require('../IAuthenticationTokenManager');

describe('An AuthenticationTokenManger interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const authenticationTokenManger = new IAuthenticationTokenManager();

    // Act & Assert
    await expect(() => authenticationTokenManger.createAccessToken('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'));
    await expect(() => authenticationTokenManger.createRefreshToken('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'));
    await expect(() => authenticationTokenManger.verifyRefreshToken('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'));
    await expect(() => authenticationTokenManger.decodePayload('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'));
  });
});
