const CreatedThread = require('../CreatedThread');

describe('CreatedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
    };

    // Act & Assert
    expect(() => new CreatedThread(payload)).toThrow(Error('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      owner: 123,
    };

    // Act & Assert
    expect(() => new CreatedThread(payload)).toThrow(Error('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct CreatedThread object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      owner: 'user-123',
    };

    // Act
    const actual = new CreatedThread(payload);

    // Assert
    expect(actual).toBeInstanceOf(CreatedThread);
    expect(actual.id).toEqual(payload.id);
    expect(actual.title).toEqual(payload.title);
    expect(actual.owner).toEqual(payload.owner);
  });
});
