const Authentication = require('../../../Domains/authentications/entities/Authentication');
const IAuthenticationRepository = require('../../../Domains/authentications/IAuthenticationRepository');
const IUserRepository = require('../../../Domains/users/IUserRepository');
const IAuthenticationTokenManager = require('../../security/IAuthenticationTokenManager');
const IPasswordHash = require('../../security/IPasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');

describe('LoginUser use case', () => {
  it('should orchestrating the login user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'albert',
      password: 'secret',
    };

    const fakerAuthentication = new Authentication({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const fakerRequestToken = {
      username: 'albert',
      id: 'user-123',
    };

    const mockUserRepository = new IUserRepository();
    const mockAuthenticationRepository = new IAuthenticationRepository();
    const mockAuthenticationTokenManager = new IAuthenticationTokenManager();
    const mockPasswordHash = new IPasswordHash();

    mockUserRepository.getPasswordByUsername = jest.fn(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = jest.fn(() => Promise.resolve());
    mockUserRepository.getUserIdByUsername = jest.fn(() => Promise.resolve('user-123'));
    mockAuthenticationTokenManager.createAccessToken = jest.fn(() => Promise.resolve(fakerAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn(() => Promise.resolve(fakerAuthentication.refreshToken));
    mockAuthenticationRepository.addToken = jest.fn(() => Promise.resolve());

    const sut = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Act
    const actual = await sut.execute(useCasePayload);

    // Assert
    expect(actual).toEqual(new Authentication({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    }));

    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith('albert');
    expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getUserIdByUsername).toHaveBeenCalledWith('albert');
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith(fakerRequestToken);
    expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith(fakerRequestToken);
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith('refresh_token');
  });
});
