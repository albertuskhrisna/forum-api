const ICommentRepository = require('../../../Domains/comments/ICommentRepository');
const ICommentLikesRepository = require('../../../Domains/commentLikes/ICommentLikesRepository');
const CommentLikes = require('../../../Domains/commentLikes/entities/CommentLikes');
const ToggleCommentLikesUseCase = require('../ToggleCommentLikesUseCase');

describe('Toggle Comment Likes use case', () => {
  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const fakerCommentLikes = new CommentLikes({
      commentId: 'comment-123',
      userId: 'user-123',
    });

    const mockCommentRepository = new ICommentRepository();
    const mockCommentLikesRepository = new ICommentLikesRepository();
    mockCommentRepository.checkCommentAvailability = jest.fn(() => Promise.resolve());
    mockCommentLikesRepository.checkCommentLikeAvailability = jest.fn(() => Promise.resolve(false));
    mockCommentLikesRepository.addLike = jest.fn(() => Promise.resolve(fakerCommentLikes));

    const sut = new ToggleCommentLikesUseCase({ commentRepository: mockCommentRepository, commentLikesRepository: mockCommentLikesRepository });

    // Act
    const actual = await sut.execute('user-123', 'comment-123', 'thread-123');

    // Assert
    expect(actual).toStrictEqual(new CommentLikes({ commentId: 'comment-123', userId: 'user-123' }));
    expect(mockCommentRepository.checkCommentAvailability).toHaveBeenCalledWith('comment-123', 'thread-123');
    expect(mockCommentLikesRepository.checkCommentLikeAvailability).toHaveBeenCalledWith(fakerCommentLikes);
    expect(mockCommentLikesRepository.addLike).toHaveBeenCalledWith(fakerCommentLikes);
  });

  it('should orchestrating the delete like action correctly', async () => {
    // Arrange
    const fakerCommentLikes = new CommentLikes({
      commentId: 'comment-123',
      userId: 'user-123',
    });

    const mockCommentRepository = new ICommentRepository();
    const mockCommentLikesRepository = new ICommentLikesRepository();
    mockCommentRepository.checkCommentAvailability = jest.fn(() => Promise.resolve());
    mockCommentLikesRepository.checkCommentLikeAvailability = jest.fn(() => Promise.resolve(true));
    mockCommentLikesRepository.deleteLike = jest.fn(() => Promise.resolve(fakerCommentLikes));

    const sut = new ToggleCommentLikesUseCase({ commentRepository: mockCommentRepository, commentLikesRepository: mockCommentLikesRepository });

    // Act
    const actual = await sut.execute('user-123', 'comment-123', 'thread-123');

    // Assert
    expect(actual).toStrictEqual(new CommentLikes({ commentId: 'comment-123', userId: 'user-123' }));
    expect(mockCommentRepository.checkCommentAvailability).toHaveBeenCalledWith('comment-123', 'thread-123');
    expect(mockCommentLikesRepository.checkCommentLikeAvailability).toHaveBeenCalledWith(fakerCommentLikes);
    expect(mockCommentLikesRepository.deleteLike).toHaveBeenCalledWith(fakerCommentLikes);
  });
});
