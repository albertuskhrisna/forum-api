const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should persist token to database', async () => {
      // Arrange
      const fakerPayload = 'token';
      const sut = new AuthenticationRepositoryPostgres(pool);

      // Act
      await sut.addToken(fakerPayload);

      // Assert
      const actualDb = await AuthenticationsTableTestHelper.findToken(fakerPayload);
      expect(actualDb).toHaveLength(1);
      expect(actualDb[0].token).toBe(fakerPayload);
    });
  });

  describe('checkTokenAvailability function', () => {
    it('should throw InvariantError when token not found', async () => {
      // Arrange
      const fakerPayload = 'token';
      const sut = new AuthenticationRepositoryPostgres(pool);

      // Act & Assert
      await expect(sut.checkTokenAvailability(fakerPayload))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when token found', async () => {
      // Arrange
      const fakerPayload = 'token';
      await AuthenticationsTableTestHelper.addToken(fakerPayload);
      const sut = new AuthenticationRepositoryPostgres(pool);

      // Act & Assert
      await expect(sut.checkTokenAvailability(fakerPayload))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('deleteToken function', () => {
    it('should delete token from database', async () => {
      // Arrange
      const fakerPayload = 'token';
      await AuthenticationsTableTestHelper.addToken(fakerPayload);
      const sut = new AuthenticationRepositoryPostgres(pool);

      // Act
      await sut.deleteToken(fakerPayload);

      // Assert
      const actualDb = await AuthenticationsTableTestHelper.findToken(fakerPayload);
      expect(actualDb).toHaveLength(0);
    });
  });
});
