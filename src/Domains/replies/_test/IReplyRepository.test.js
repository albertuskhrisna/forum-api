const IReplyRepository = require('../IReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const replyRepository = new IReplyRepository();

    // Assert
    await expect(() => replyRepository.addReply('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => replyRepository.getRepliesByCommentIds('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => replyRepository.checkReplyAvailability('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => replyRepository.checkReplyOwner('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
    await expect(() => replyRepository.deleteReplyById('')).rejects.toThrow(Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'));
  });
});
