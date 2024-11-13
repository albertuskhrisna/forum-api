const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('A JwtTokenManager', () => {
  describe('A createAccessToken function', () => {
    it('should create access token correctly', async () => {
      // Arrange
      const fakerAccessTokenPayload = {
        username: 'albert',
      };

      const mockJwtToken = {
        generate: jest.fn(() => 'mock_token'),
      };

      const sut = new JwtTokenManager(mockJwtToken);

      // Act
      const actual = await sut.createAccessToken(fakerAccessTokenPayload);

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(fakerAccessTokenPayload, process.env.ACCESS_TOKEN_KEY);
      expect(actual).toEqual('mock_token');
    });
  });

  describe('A createRefreshToken function', () => {
    it('should create access token correctly', async () => {
      // Arrange
      const fakerRefreshTokenPayload = {
        username: 'albert',
      };

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };

      const sut = new JwtTokenManager(mockJwtToken);

      // Act
      const actual = await sut.createRefreshToken(fakerRefreshTokenPayload);

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(fakerRefreshTokenPayload, process.env.REFRESH_TOKEN_KEY);
      expect(actual).toEqual('mock_token');
    });
  });

  describe('A verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const fakerAccessTokenPayload = {
        username: 'albert',
      };
      const sut = new JwtTokenManager(Jwt.token);
      const accessToken = await sut.createAccessToken(fakerAccessTokenPayload);

      // Act & Assert
      await expect(sut.verifyRefreshToken(accessToken))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const fakerRefreshTokenPayload = {
        username: 'albert',
      };
      const sut = new JwtTokenManager(Jwt.token);
      const refreshToken = await sut.createRefreshToken(fakerRefreshTokenPayload);

      // Act & Assert
      await expect(sut.verifyRefreshToken(refreshToken))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('A decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const fakerAccessTokenPayload = {
        username: 'albert',
      };
      const sut = new JwtTokenManager(Jwt.token);
      const accessToken = await sut.createAccessToken(fakerAccessTokenPayload);

      // Act
      const { username: actual } = await sut.decodePayload(accessToken);

      // Assert
      expect(actual).toEqual('albert');
    });
  });
});
