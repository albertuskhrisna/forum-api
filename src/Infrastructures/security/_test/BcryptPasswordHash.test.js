const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('A BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Act
      const act = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof act).toEqual('string');
      expect(act).not.toEqual('plain_password');
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10);
    });
  });

  describe('comparePassword function', () => {
    it('should throw AuthenticationError when password not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Assert
      await expect(() => bcryptPasswordHash.comparePassword('plain_password', 'encrypted_password'))
        .rejects.toThrow(AuthenticationError);
    });

    it('should not throw AuthenticationError when password is match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'plain_password';
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);

      // Assert
      await expect(bcryptPasswordHash.comparePassword(plainPassword, encryptedPassword))
        .resolves.not.toThrow(AuthenticationError);
    });
  });
});
