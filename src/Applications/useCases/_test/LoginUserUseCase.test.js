const Authentication = require('../../../Domains/authentication/entities/Authentication');
const IAuthenticationRepository = require('../../../Domains/authentication/IAuthenticationRepository');
const IUserRepository = require('../../../Domains/users/IUserRepository');
const IAuthenticationTokenManager = require('../../security/IAuthenticationTokenManager');
const IPasswordHash = require('../../security/IPasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');

describe('A LoginUserUseCase', () => {
  it('should orchestrating the login user action correctly', async () => {
    // Arrange
    const payload = {
      username: 'albert',
      password: 'secret',
    };

    const mockAuthentication = new Authentication({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const mockUserRepository = new IUserRepository();
    const mockAuthenticationRepository = new IAuthenticationRepository();
    const mockAuthenticationTokenManager = new IAuthenticationTokenManager();
    const mockPasswordHash = new IPasswordHash();

    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getUserIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAuthentication.refreshToken));
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Act
    const actual = await loginUserUseCase.execute(payload);

    // Assert
    expect(actual).toEqual(new Authentication({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    }));
    expect(mockUserRepository.getPasswordByUsername)
      .toHaveBeenCalledWith('albert');
    expect(mockPasswordHash.comparePassword)
      .toHaveBeenCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getUserIdByUsername)
      .toHaveBeenCalledWith('albert');
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toHaveBeenCalledWith({ username: 'albert', id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toHaveBeenCalledWith({ username: 'albert', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken)
      .toHaveBeenCalledWith('refresh_token');
  });
});
