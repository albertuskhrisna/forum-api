const IAuthenticationRepository = require('../IAuthenticationRepository');

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const authenticationRepository = new IAuthenticationRepository();

    // Assert
    await expect(() => authenticationRepository.addToken('')).rejects.toThrow(Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => authenticationRepository.checkTokenAvailability('')).rejects.toThrow(Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => authenticationRepository.deleteToken('')).rejects.toThrow(Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
