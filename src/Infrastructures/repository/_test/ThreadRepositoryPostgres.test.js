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
    it('should persist thread to database', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });

      const expectedCreatedThread = new CreatedThread({
        id: 'thread-123',
        title: 'thread title',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const sut = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Act
      const actual = await sut.addThread(createThread);

      // Assert
      const addedThread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(addedThread).toHaveLength(1);
      expect(actual).toBeInstanceOf(CreatedThread);
      expect(actual).toStrictEqual(expectedCreatedThread);
    });
  });

  describe('checkThreadAvailability function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const sut = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-123';

      // Act & Assert
      await expect(sut.checkThreadAvailability(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      const sut = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId, userId: 'user-123' });

      // Act & Assert
      await expect(sut.checkThreadAvailability(threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const sut = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-123';

      // Act & Assert
      await expect(sut.getThreadById(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should return expected thread when thread found', async () => {
      // Arrange
      const sut = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      const expectedThread = {
        id: 'thread-123',
        title: 'a thread',
        body: 'thread body',
        date: '2024-10-30T08:00:00.000Z',
        username: 'albert',
      };
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: expectedThread.id, userId: 'user-123' });

      // Act
      const actual = await sut.getThreadById(threadId);

      // Assert
      expect(actual).toStrictEqual(expectedThread);
    });
  });
});
