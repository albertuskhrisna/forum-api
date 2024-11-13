const IAuthenticationRepository = require('../../../Domains/authentications/IAuthenticationRepository');
const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('LogoutUser use case', () => {
  it('should throw error when payload did not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    const sut = new LogoutUserUseCase({});

    // Act & Assert
    expect(() => sut.execute(useCasePayload))
      .rejects.toThrow(Error('LOGOUT_USER_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when refresh token is not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123,
    };
    const sut = new LogoutUserUseCase({});

    // Act & Assert
    expect(() => sut.execute(useCasePayload))
      .rejects.toThrow(Error('LOGOUT_USER_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };

    const mockAuthenticationRepository = new IAuthenticationRepository();
    mockAuthenticationRepository.checkTokenAvailability = jest.fn(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn(() => Promise.resolve());

    const sut = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await sut.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkTokenAvailability).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
