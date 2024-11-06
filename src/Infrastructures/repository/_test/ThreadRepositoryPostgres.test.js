const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
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

      const fakeIdGenerator = () => '123';
      const sut = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      await sut.addThread(createThread);

      // Assert
      const addedThread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(addedThread).toHaveLength(1);
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
      await ThreadsTableTestHelper.addThread({ id: threadId });

      // Act & Assert
      await expect(sut.checkThreadAvailability(threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
