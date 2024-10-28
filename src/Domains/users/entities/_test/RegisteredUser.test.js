const RegisteredUser = require('../RegisteredUser');

describe('A RegisteredUser', () => {
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

  it('should create RegisteredUser object correctly', () => {
    // Arrange
    const payload = {
      id: 'A',
      username: 'B',
      fullname: 'C',
    };

    // Act
    const { id, username, fullname } = new RegisteredUser(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
  });
});
