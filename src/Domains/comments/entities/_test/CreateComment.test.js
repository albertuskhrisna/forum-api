const CreateComment = require('../CreateComment');

describe('CreateComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'a comment content',
      threadId: 'thread-123',
    };

    // Act & Assert
    expect(() => new CreateComment(payload)).toThrow(Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'a comment content',
      threadId: 'thread-123',
      owner: 123,
    };

    // Act & Assert
    expect(() => new CreateComment(payload)).toThrow(Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct CreateComment object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      content: 'a comment content',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Act
    const actual = new CreateComment(payload);

    // Assert
    expect(actual).toBeInstanceOf(CreateComment);
    expect(actual.content).toEqual(payload.content);
    expect(actual.threadId).toEqual(payload.threadId);
    expect(actual.owner).toEqual(payload.owner);
  });
});
