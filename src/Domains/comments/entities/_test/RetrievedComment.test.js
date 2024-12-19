const RetrievedComment = require('../RetrievedComment');

describe('RetrievedComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDeleted: true,
    };

    // Act & Assert
    expect(() => new RetrievedComment(payload)).toThrow(Error('RETRIEVED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: true,
      isDeleted: {},
      replies: [],
      likeCount: '10',
    };

    // Act & Assert
    expect(() => new RetrievedComment(payload)).toThrow(Error('RETRIEVED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct RetrievedComment object without deleted_content correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDeleted: false,
      replies: [],
      likeCount: 10,
    };

    // Act
    const actual = new RetrievedComment(payload);

    // Assert
    expect(actual).toBeInstanceOf(RetrievedComment);
    expect(actual.id).toEqual(payload.id);
    expect(actual.username).toEqual(payload.username);
    expect(actual.date).toEqual(payload.date);
    expect(actual.replies).toEqual(payload.replies);
    expect(actual.content).toEqual(payload.content);
  });

  it('should construct RetrievedComment object with deleted_content correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDeleted: true,
      replies: [],
      likeCount: 10,
    };

    // Act
    const actual = new RetrievedComment(payload);

    // Assert
    expect(actual).toBeInstanceOf(RetrievedComment);
    expect(actual.id).toEqual(payload.id);
    expect(actual.username).toEqual(payload.username);
    expect(actual.date).toEqual(payload.date);
    expect(actual.replies).toEqual(payload.replies);
    expect(actual.content).toEqual('**komentar telah dihapus**');
  });
});
