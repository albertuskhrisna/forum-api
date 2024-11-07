const CreateReply = require('../CreateReply');

describe('CreateReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'a reply content',
      commentId: 'comment-123',
    };

    // Act & Assert
    expect(() => new CreateReply(payload)).toThrow(Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'a reply content',
      commentId: 'comment-123',
      owner: 123,
    };

    // Act & Assert
    expect(() => new CreateReply(payload)).toThrow(Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct CreateReply object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      content: 'a reply content',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Act
    const actual = new CreateReply(payload);

    // Assert
    expect(actual).toBeInstanceOf(CreateReply);
    expect(actual.content).toEqual(payload.content);
    expect(actual.commentId).toEqual(payload.commentId);
    expect(actual.owner).toEqual(payload.owner);
  });
});
