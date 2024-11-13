const IThreadRepository = require('../IThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const sut = new IThreadRepository();

    // Act & Assert
    await expect(() => sut.addThread('')).rejects.toThrow(Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.checkThreadAvailability('')).rejects.toThrow(Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.getThreadById('')).rejects.toThrow(Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
