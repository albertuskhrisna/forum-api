const CreatedComment = require('../CreatedComment');

describe('CreatedComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'a comment content',
    };

    // Act & Assert
    expect(() => new CreatedComment(payload)).toThrow(Error('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'a comment content',
      owner: 123,
    };

    // Act & Assert
    expect(() => new CreatedComment(payload)).toThrow(Error('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct CreatedComment object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'a comment content',
      owner: 'user-123',
    };

    // Act
    const actual = new CreatedComment(payload);

    // Assert
    expect(actual).toBeInstanceOf(CreatedComment);
    expect(actual.id).toEqual(payload.id);
    expect(actual.content).toEqual(payload.content);
    expect(actual.owner).toEqual(payload.owner);
  });
});
