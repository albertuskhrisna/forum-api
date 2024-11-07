const ICommentRepository = require('../../../Domains/comments/ICommentRepository');
const IReplyRepository = require('../../../Domains/replies/IReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('Delete Reply use case', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const mockCommentRepository = new ICommentRepository();
    const mockReplyRepository = new IReplyRepository();
    mockCommentRepository.checkCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const sut = new DeleteReplyUseCase({ commentRepository: mockCommentRepository, replyRepository: mockReplyRepository });

    // Act
    await sut.execute('reply-123', 'comment-123', 'thread-123', 'user-123');

    // Assert
    expect(mockCommentRepository.checkCommentAvailability).toHaveBeenCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.checkReplyAvailability).toHaveBeenCalledWith('reply-123', 'comment-123');
    expect(mockReplyRepository.checkReplyOwner).toHaveBeenCalledWith('reply-123', 'user-123');
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith('reply-123');
  });
});
