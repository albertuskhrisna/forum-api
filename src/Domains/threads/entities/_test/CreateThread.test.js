const CreateThread = require('../CreateThread');

describe('CreateThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'A',
      body: 'B',
    };

    // Act & Assert
    expect(() => new CreateThread(payload)).toThrow(Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'A',
      body: 123,
      owner: true,
    };

    // Act & Assert
    expect(() => new CreateThread(payload)).toThrow(Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct CreateThread object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      title: 'A',
      body: 'B',
      owner: 'user-123',
    };

    // Act
    const actual = new CreateThread(payload);

    // Assert
    expect(actual).toBeInstanceOf(CreateThread);
    expect(actual.title).toEqual(payload.title);
    expect(actual.body).toEqual(payload.body);
    expect(actual.owner).toEqual(payload.owner);
  });
});
