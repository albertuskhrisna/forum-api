const IAuthenticationRepository = require('../../../Domains/authentications/IAuthenticationRepository');
const IAuthenticationTokenManager = require('../../security/IAuthenticationTokenManager');
const RefreshTokenUseCase = require('../RefreshTokenUseCase');

describe('RefreshToken use case', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const sut = new RefreshTokenUseCase({});

    // Act & Assert
    await expect(() => sut.execute(useCasePayload))
      .rejects.toThrow(Error('REFRESH_TOKEN_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123,
    };
    const sut = new RefreshTokenUseCase({});

    // Act & Assert
    await expect(() => sut.execute(useCasePayload))
      .rejects.toThrow(Error('REFRESH_TOKEN_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };

    const fakerRequestToken = {
      id: 'user-123', username: 'albert',
    };

    const mockAuthenticationRepository = new IAuthenticationRepository();
    const mockAuthenticationTokenManager = new IAuthenticationTokenManager();

    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn(() => Promise.resolve());
    mockAuthenticationRepository.checkTokenAvailability = jest.fn(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn(() => Promise.resolve(fakerRequestToken));
    mockAuthenticationTokenManager.createAccessToken = jest.fn(() => Promise.resolve('new_access_token'));

    const sut = new RefreshTokenUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Act
    const actual = await sut.execute(useCasePayload);

    // Assert
    expect(actual).toEqual('new_access_token');
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.checkTokenAvailability).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith(fakerRequestToken);
  });
});
