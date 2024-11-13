const IThreadRepository = require('../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../Domains/comments/ICommentRepository');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('Add Comment use case', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'a comment content',
    };

    const createComment = new CreateComment({
      content: payload.content,
      threadId: 'thread-123',
      owner: 'user-123',
    });

    const expected = new CreatedComment({
      id: 'comment-123',
      content: payload.content,
      owner: 'user-123',
    });

    const mockThreadRepository = new IThreadRepository();
    const mockCommentRepository = new ICommentRepository();
    mockThreadRepository.checkThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(expected));

    const sut = new AddCommentUseCase({ threadRepository: mockThreadRepository, commentRepository: mockCommentRepository });

    // Act
    const actual = await sut.execute('user-123', 'thread-123', payload);

    // Assert
    expect(actual).toStrictEqual(new CreatedComment({
      id: expected.id,
      content: expected.content,
      owner: expected.owner,
    }));

    expect(mockThreadRepository.checkThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(createComment);
  });
});
