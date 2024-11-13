const IReplyRepository = require('../IReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const sut = new IReplyRepository();

    // Act & Assert
    await expect(() => sut.addReply('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.getRepliesByCommentIds('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.checkReplyAvailability('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.checkReplyOwner('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => sut.deleteReplyById('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
