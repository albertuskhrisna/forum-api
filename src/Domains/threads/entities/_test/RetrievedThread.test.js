const RetrievedThread = require('../RetrievedThread');

describe('RetrievedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2021-08-08T07:22:33.555Z',
      username: 'john doe',
    };

    // Act & Assert
    expect(() => new RetrievedThread(payload)).toThrow(Error('RETRIEVED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2021-08-08T07:22:33.555Z',
      username: 123,
      comments: {},
    };

    // Act & Assert
    expect(() => new RetrievedThread(payload)).toThrow(Error('RETRIEVED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct RetrievedThread object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: '2021-08-08T07:22:33.555Z',
      username: 'john doe',
      comments: [],
    };

    // Act
    const actual = new RetrievedThread(payload);

    // Assert
    expect(actual).toBeInstanceOf(RetrievedThread);
    expect(actual.id).toEqual(payload.id);
    expect(actual.title).toEqual(payload.title);
    expect(actual.body).toEqual(payload.body);
    expect(actual.date).toEqual(payload.date);
    expect(actual.username).toEqual(payload.username);
    expect(actual.comments).toEqual(payload.comments);
  });
});
