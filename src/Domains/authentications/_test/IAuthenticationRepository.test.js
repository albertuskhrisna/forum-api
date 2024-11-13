const IAuthenticationRepository = require('../IAuthenticationRepository');

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const sut = new IAuthenticationRepository();

    // Act & Assert
    await expect(() => sut.addToken('')).rejects.toThrow(Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.checkTokenAvailability('')).rejects.toThrow(Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.deleteToken('')).rejects.toThrow(Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
