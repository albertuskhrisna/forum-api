const RetrievedReply = require('../RetrievedReply');

describe('RetrievedReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
      date: '2021-08-08T07:22:33.555Z',
      username: 'johndoe',
    };

    // Act & Assert
    expect(() => new RetrievedReply(payload)).toThrow(Error('RETRIEVED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah reple',
      date: '2021-08-08T07:22:33.555Z',
      username: true,
      isDeleted: {},
    };

    // Act & Assert
    expect(() => new RetrievedReply(payload)).toThrow(Error('RETRIEVED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct RetrievedReply object without deleted_content correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah reply',
      isDeleted: false,
    };

    // Act
    const actual = new RetrievedReply(payload);

    // Assert
    expect(actual).toStrictEqual(new RetrievedReply({
      id: payload.id,
      username: payload.username,
      date: payload.date,
      content: payload.content,
      isDeleted: false,
    }));
  });

  it('should construct RetrievedReply object with deleted_content correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah reply',
      isDeleted: true,
    };

    // Act
    const actual = new RetrievedReply(payload);

    // Assert
    expect(actual).toBeInstanceOf(RetrievedReply);
    expect(actual.id).toEqual(payload.id);
    expect(actual.username).toEqual(payload.username);
    expect(actual.date).toEqual(payload.date);
    expect(actual.content).toEqual('**balasan telah dihapus**');
  });
});
