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
    it('should persist register user', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'albert',
        password: 'secret',
        fullname: 'Albertus Khrisna',
      });
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const user = await UsersTableTestHelper.findUserById('user-123');
      expect(user).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'albert',
        password: 'secret',
        fullname: 'Albertus Khrisna',
      });
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'albert',
        fullname: 'Albertus Khrisna',
      }));
    });
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'albert' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Assert
      expect(userRepositoryPostgres.verifyAvailableUsername('albert')).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Assert
      expect(userRepositoryPostgres.verifyAvailableUsername('albert')).resolves.not.toThrow(InvariantError);
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Assert
      expect(() => userRepositoryPostgres.getPasswordByUsername('albert'))
        .rejects.toThrow(InvariantError);
    });

    it('should return user password when user found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username: 'albert',
        password: 'secret',
      });

      // Act
      const userPassword = await userRepositoryPostgres.getPasswordByUsername('albert');

      // Assert
      expect(userPassword).toBe('secret');
    });
  });

  describe('getUserIdByUsername function', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Assert
      expect(() => userRepositoryPostgres.getUserIdByUsername('albert'))
        .rejects.toThrow(InvariantError);
    });

    it('should return user id when user found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'albert',
      });

      // Act
      const userId = await userRepositoryPostgres.getUserIdByUsername('albert');

      // Assert
      expect(userId).toBe('user-123');
    });
  });
});
