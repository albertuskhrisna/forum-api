const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const IUserRepository = require('../../../Domains/users/IUserRepository');
const IPasswordHash = require('../../security/IPasswordHash');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUser use case', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const payload = {
      username: 'albertus',
      password: 'secret',
      fullname: 'Albertus Khrisna',
    };

    const expected = new RegisteredUser({
      id: 'user-123',
      username: payload.username,
      fullname: payload.fullname,
    });

    const mockUserRepository = new IUserRepository();
    const mockPasswordHash = new IPasswordHash();

    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(expected));

    const sut = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Act
    const actual = await sut.execute(payload);

    // Assert
    expect(actual).toStrictEqual(new RegisteredUser({
      id: expected.id,
      username: expected.username,
      fullname: expected.fullname,
    }));

    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(payload.username);
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(payload.password);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(new RegisterUser({
      username: payload.username,
      password: 'encrypted_password',
      fullname: payload.fullname,
    }));
  });
});
