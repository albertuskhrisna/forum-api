const CommentLikes = require('../CommentLikes');

describe('CommentLikes entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'A',
    };

    // Act & Assert
    expect(() => new CommentLikes(payload)).toThrow(Error('COMMENT_LIKES.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 'A',
      userId: 123,
    };

    // Act & Assert
    expect(() => new CommentLikes(payload)).toThrow(Error('COMMENT_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct CommentLikes object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      commentId: 'A',
      userId: 'B',
    };

    // Act
    const actual = new CommentLikes(payload);

    // Assert
    expect(actual).toBeInstanceOf(CommentLikes);
    expect(actual.commentId).toEqual(payload.commentId);
    expect(actual.fullname).toEqual(payload.fullname);
  });
});
