const ICommentRepository = require('../../../Domains/comments/ICommentRepository');
const IReplyRepository = require('../../../Domains/replies/IReplyRepository');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('Add Reply use case', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'a reply content',
    };

    const fakerCreateReply = new CreateReply({
      content: useCasePayload.content,
      commentId: 'comment-123',
      owner: 'user-123',
    });

    const fakerCreatedReply = new CreatedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const expectedReturn = new CreatedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const mockCommentRepository = new ICommentRepository();
    const mockReplyRepository = new IReplyRepository();
    mockCommentRepository.checkCommentAvailability = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(fakerCreatedReply));

    const sut = new AddReplyUseCase({ commentRepository: mockCommentRepository, replyRepository: mockReplyRepository });

    // Act
    const actual = await sut.execute('user-123', 'comment-123', 'thread-123', useCasePayload);

    // Assert
    expect(actual).toStrictEqual(expectedReturn);
    expect(mockCommentRepository.checkCommentAvailability).toHaveBeenCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(fakerCreateReply);
  });
});
