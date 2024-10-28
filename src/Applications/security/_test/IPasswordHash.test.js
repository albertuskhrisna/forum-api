const IPasswordHash = require('../IPasswordHash');

describe('A PasswordHash interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const passwordHash = new IPasswordHash();

    // Assert
    await expect(() => passwordHash.hash('dummy')).rejects.toThrow(Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED'));
    await expect(() => passwordHash.comparePassword('dummy')).rejects.toThrow(Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED'));
  });
});
