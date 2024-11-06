const LoginUser = require('../LoginUser');

describe('LoginUser entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'A',
    };

    // Act & Assert
    expect(() => new LoginUser(payload)).toThrow(Error('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when did not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 'A',
      password: 123,
    };

    // Act & Assert
    expect(() => new LoginUser(payload)).toThrow(Error('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct LoginUser object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      username: 'A',
      password: 'B',
    };

    // Act
    const actual = new LoginUser(payload);

    // Assert
    expect(actual).toBeInstanceOf(LoginUser);
    expect(actual.username).toEqual(payload.username);
    expect(actual.fullname).toEqual(payload.fullname);
  });
});
