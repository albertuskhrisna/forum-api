const IThreadRepository = require('../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../Domains/comments/ICommentRepository');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('Add Comment use case', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'a comment content',
    };

    const fakerCreateComment = new CreateComment({
      content: useCasePayload.content,
      threadId: 'thread-123',
      owner: 'user-123',
    });

    const fakerCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const expectedReturn = new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const mockThreadRepository = new IThreadRepository();
    const mockCommentRepository = new ICommentRepository();
    mockThreadRepository.checkThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(fakerCreatedComment));

    const sut = new AddCommentUseCase({ threadRepository: mockThreadRepository, commentRepository: mockCommentRepository });

    // Act
    const actual = await sut.execute('user-123', 'thread-123', useCasePayload);

    // Assert
    expect(actual).toStrictEqual(expectedReturn);
    expect(mockThreadRepository.checkThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(fakerCreateComment);
  });
});
