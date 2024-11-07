const ICommentRepository = require('../../../Domains/comments/ICommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('Delete Comment use case', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const mockCommentRepository = new ICommentRepository();
    mockCommentRepository.checkCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const sut = new DeleteCommentUseCase({ commentRepository: mockCommentRepository });

    // Act
    await sut.execute('comment-123', 'thread-123', 'user-123');

    // Assert
    expect(mockCommentRepository.checkCommentAvailability).toHaveBeenCalledWith('comment-123', 'thread-123');
    expect(mockCommentRepository.checkCommentOwner).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith('comment-123');
  });
});
