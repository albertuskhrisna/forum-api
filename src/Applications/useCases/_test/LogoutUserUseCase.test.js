const IAuthenticationRepository = require('../../../Domains/authentication/IAuthenticationRepository');
const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('A LogoutUserUseCase', () => {
  it('should throw error when payload did not contain refresh token', async () => {
    // Arrange
    const payload = {};
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Act & Assert
    expect(() => logoutUserUseCase.execute(payload))
      .rejects.toThrow(Error('LOGOUT_USER_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when refresh token is not string', async () => {
    // Arrange
    const payload = {
      refreshToken: 123,
    };
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Act & Assert
    expect(() => logoutUserUseCase.execute(payload))
      .rejects.toThrow(Error('LOGOUT_USER_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const payload = {
      refreshToken: 'refresh_token',
    };

    const mockAuthenticationRepository = new IAuthenticationRepository();
    mockAuthenticationRepository.checkTokenAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await logoutUserUseCase.execute(payload);

    // Assert
    expect(mockAuthenticationRepository.checkTokenAvailability).toHaveBeenCalledWith(payload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(payload.refreshToken);
  });
});
