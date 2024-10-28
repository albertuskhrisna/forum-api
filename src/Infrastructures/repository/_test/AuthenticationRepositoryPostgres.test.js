const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('An AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('An addToken function', () => {
    it('should persist token to database', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';

      // Act
      await authenticationRepositoryPostgres.addToken(token);

      // Assert
      const act = await AuthenticationsTableTestHelper.findToken(token);
      expect(act).toHaveLength(1);
      expect(act[0].token).toBe(token);
    });
  });

  describe('An checkTokenAvailability function', () => {
    it('should throw InvariantError when token not found', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';

      // Act & Assert
      await expect(authenticationRepositoryPostgres.checkTokenAvailability(token))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when token found', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Act & Assert
      await expect(authenticationRepositoryPostgres.checkTokenAvailability(token))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('A deleteToken function', () => {
    it('should delete token from database', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Act
      await authenticationRepositoryPostgres.deleteToken(token);

      // Assert
      const act = await AuthenticationsTableTestHelper.findToken(token);
      expect(act).toHaveLength(0);
    });
  });
});
