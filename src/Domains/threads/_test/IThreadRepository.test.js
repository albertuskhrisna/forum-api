const IThreadRepository = require('../IThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new IThreadRepository();

    // Assert
    await expect(() => threadRepository.addThread('')).rejects.toThrow(Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => threadRepository.getThreadById('')).rejects.toThrow(Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
