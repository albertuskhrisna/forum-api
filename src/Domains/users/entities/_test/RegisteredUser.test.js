const RegisteredUser = require('../RegisteredUser');

describe('RegisteredUser entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'A',
      fullname: 'B',
    };

    // Act & Assert
    expect(() => new RegisteredUser(payload)).toThrow(Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      username: 1,
      fullname: true,
    };

    // Act & Assert
    expect(() => new RegisteredUser(payload)).toThrow(Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should construct RegisteredUser object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      id: 'A',
      username: 'B',
      fullname: 'C',
    };

    // Act
    const actual = new RegisteredUser(payload);

    // Assert
    expect(actual).toBeInstanceOf(RegisteredUser);
    expect(actual.id).toEqual(payload.id);
    expect(actual.username).toEqual(payload.username);
    expect(actual.fullname).toEqual(payload.fullname);
  });
});
