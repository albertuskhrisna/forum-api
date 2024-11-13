const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const IUserRepository = require('../../../Domains/users/IUserRepository');
const IPasswordHash = require('../../security/IPasswordHash');
const AddUserUseCase = require('../AddUserUseCase');

describe('AddUser use case', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'albertus',
      password: 'secret',
      fullname: 'Albertus Khrisna',
    };

    const fakerRegisterUser = new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    });

    const fakerRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const expectedReturn = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepository = new IUserRepository();
    const mockPasswordHash = new IPasswordHash();

    mockUserRepository.verifyAvailableUsername = jest.fn(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn(() => Promise.resolve(fakerRegisteredUser));

    const sut = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Act
    const actual = await sut.execute(useCasePayload);

    // Assert
    expect(actual).toStrictEqual(expectedReturn);
    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(fakerRegisterUser);
  });
});
