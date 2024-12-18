const RegisterUser = require('../RegisterUser');

describe('RegisterUser entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'A',
      password: 'B',
    };

    // Act & Assert
    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 1,
      password: true,
      fullname: 'A',
    };

    // Act & Assert
    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should throw error when username length is more than 50 characters', () => {
    // Arrange
    const payload = {
      username: 'albertuskhrisnaalbertuskhrisnaalbertuskhrisnaalbertuskhrisna',
      password: 'A',
      fullname: 'B',
    };

    // Act & Assert
    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.USERNAME_IS_MORE_THAN_50_CHARACTERS'));
  });

  it('should throw error when username contain restricted character', () => {
    // Arrange
    const payload = {
      username: 'albertus khrisna',
      password: 'A',
      fullname: 'B',
    };

    // Act & Assert
    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'));
  });

  it('should construct RegisterUser object correctly when payload is valid', () => {
    // Arrange
    const payload = {
      username: 'A',
      password: 'B',
      fullname: 'C',
    };

    // Act
    const actual = new RegisterUser(payload);

    // Assert
    expect(actual).toBeInstanceOf(RegisterUser);
    expect(actual.username).toEqual(payload.username);
    expect(actual.password).toEqual(payload.password);
    expect(actual.fullname).toEqual(payload.fullname);
  });
});
