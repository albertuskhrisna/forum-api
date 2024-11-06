const ICommentRepository = require('../ICommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentRepository = new ICommentRepository();

    // Assert
    await expect(() => commentRepository.addComment('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => commentRepository.getCommentByThreadId('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => commentRepository.checkCommentAvailability('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => commentRepository.checkCommentOwner('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => commentRepository.deleteCommentById('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
