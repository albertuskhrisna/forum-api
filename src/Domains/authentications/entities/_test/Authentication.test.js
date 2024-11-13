const Authentication = require('../Authentication');

describe('Authentication entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      accessToken: 'A',
    };

    // Act & Assert
    expect(() => new Authentication(payload)).toThrow(Error('AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 'A',
      refreshToken: 123,
    };

    // Act & Assert
    expect(() => new Authentication(payload)).toThrow(Error('AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct Authentication object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      accessToken: 'A',
      refreshToken: 'B',
    };

    // Act
    const actual = new Authentication(payload);

    // Assert
    expect(actual).toBeInstanceOf(Authentication);
    expect(actual.accessToken).toEqual(payload.accessToken);
    expect(actual.refreshToken).toEqual(payload.refreshToken);
  });
});
