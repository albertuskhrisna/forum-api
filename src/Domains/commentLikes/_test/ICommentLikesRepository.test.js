const ICommentLikesRepository = require('../ICommentLikesRepository');

describe('CommentLikesRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const sut = new ICommentLikesRepository();

    // Act & Assert
    await expect(() => sut.addLike('')).rejects.toThrow(Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.getLikesCountByCommentIds('')).rejects.toThrow(Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.checkCommentLikeAvailability('')).rejects.toThrow(Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.deleteLike('')).rejects.toThrow(Error('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
