const LoginUser = require('../LoginUser');

describe('A LoginUser', () => {
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

  it('should create LoginUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'A',
      password: 'B',
    };

    // Act
    const { username, fullname } = new LoginUser(payload);

    // Assert
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
  });
});
