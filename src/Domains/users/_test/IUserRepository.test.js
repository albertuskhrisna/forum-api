const IUserRepository = require('../IUserRepository');

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const sut = new IUserRepository();

    // Act & Assert
    await expect(() => sut.addUser()).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.verifyAvailableUsername()).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.getPasswordByUsername()).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.getUserIdByUsername()).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
