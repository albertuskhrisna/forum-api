const CreatedReply = require('../CreatedReply');

describe('CreatedReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'a reply content',
    };

    // Act & Assert
    expect(() => new CreatedReply(payload)).toThrow(Error('CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'a reply content',
      owner: 123,
    };

    // Act & Assert
    expect(() => new CreatedReply(payload)).toThrow(Error('CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct CreatedReply object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'a reply content',
      owner: 'user-123',
    };

    // Act
    const actual = new CreatedReply(payload);

    // Assert
    expect(actual).toBeInstanceOf(CreatedReply);
    expect(actual.id).toEqual(payload.id);
    expect(actual.content).toEqual(payload.content);
    expect(actual.owner).toEqual(payload.owner);
  });
});
