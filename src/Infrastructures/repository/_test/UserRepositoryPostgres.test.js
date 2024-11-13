const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addUser function', () => {
    it('should persist register user and return RegisteredUser entity', async () => {
      // Arrange
      const fakerPayload = new RegisterUser({
        username: 'albert',
        password: 'secret',
        fullname: 'Albertus Khrisna',
      });

      const expectedReturn = new RegisteredUser({
        id: 'user-123',
        username: 'albert',
        fullname: 'Albertus Khrisna',
      });

      const fakeIdGenerator = () => '123';
      const sut = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const actual = await sut.addUser(fakerPayload);

      // Assert
      expect(actual).toBeInstanceOf(RegisteredUser);
      expect(actual).toStrictEqual(expectedReturn);
      const actualDb = await UsersTableTestHelper.findUserById('user-123');
      expect(actualDb).toHaveLength(1);
    });
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      const fakerUsername = 'albert';
      await UsersTableTestHelper.addUser({});
      const sut = new UserRepositoryPostgres(pool, {});

      // Assert
      expect(sut.verifyAvailableUsername(fakerUsername))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const fakerUsername = 'albert';
      const sut = new UserRepositoryPostgres(pool, {});

      // Assert
      expect(sut.verifyAvailableUsername(fakerUsername))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const fakerUsername = 'albert';
      const sut = new UserRepositoryPostgres(pool, {});

      // Assert
      expect(() => sut.getPasswordByUsername(fakerUsername))
        .rejects.toThrow(InvariantError);
    });

    it('should return user password when user found', async () => {
      // Arrange
      const fakerUsername = 'albert';
      await UsersTableTestHelper.addUser({});
      const sut = new UserRepositoryPostgres(pool, {});

      // Act
      const userPassword = await sut.getPasswordByUsername(fakerUsername);

      // Assert
      expect(userPassword).toBe('secret');
    });
  });

  describe('getUserIdByUsername function', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const fakerUsername = 'albert';
      const sut = new UserRepositoryPostgres(pool, {});

      // Assert
      expect(() => sut.getUserIdByUsername(fakerUsername))
        .rejects.toThrow(InvariantError);
    });

    it('should return user id when user found', async () => {
      // Arrange
      const fakerUsername = 'albert';
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'albert',
      });
      const sut = new UserRepositoryPostgres(pool, {});

      // Act
      const userId = await sut.getUserIdByUsername(fakerUsername);

      // Assert
      expect(userId).toBe('user-123');
    });
  });
});
