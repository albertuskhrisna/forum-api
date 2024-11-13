const ICommentRepository = require('../ICommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const sut = new ICommentRepository();

    // Act & Assert
    await expect(() => sut.addComment('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.getCommentByThreadId('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.checkCommentAvailability('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.checkCommentOwner('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.deleteCommentById('')).rejects.toThrow(Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
