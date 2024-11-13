const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread to database and return CreatedReply entity', async () => {
      // Arrange
      const fakerPayload = new CreateThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });

      const expectedReturn = new CreatedThread({
        id: 'thread-123',
        title: 'thread title',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const fakeIdGenerator = () => '123';
      const sut = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const actual = await sut.addThread(fakerPayload);

      // Assert
      expect(actual).toBeInstanceOf(CreatedThread);
      expect(actual).toStrictEqual(expectedReturn);
      const actualDb = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(actualDb).toHaveLength(1);
    });
  });

  describe('checkThreadAvailability function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const sut = new ThreadRepositoryPostgres(pool, {});
      const fakerThreadId = 'thread-123';

      // Act & Assert
      await expect(sut.checkThreadAvailability(fakerThreadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      const fakerThreadId = 'thread-123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const sut = new ThreadRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(sut.checkThreadAvailability(fakerThreadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const fakerThreadId = 'thread-123';
      const sut = new ThreadRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(sut.getThreadById(fakerThreadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should return expected thread when thread found', async () => {
      // Arrange
      const fakerThreadId = 'thread-123';
      const expectedReturn = {
        id: 'thread-123',
        title: 'a thread',
        body: 'thread body',
        date: '2024-10-30T08:00:00.000Z',
        username: 'albert',
      };

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const sut = new ThreadRepositoryPostgres(pool, {});

      // Act
      const actual = await sut.getThreadById(fakerThreadId);

      // Assert
      expect(actual).toStrictEqual(expectedReturn);
    });
  });
});
