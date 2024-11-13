const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ForbiddenError = require('../../../Commons/exceptions/ForbiddenError');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment to database and return CreatedComment entity', async () => {
      // Arrange
      const fakerPayload = new CreateComment({
        content: 'a comment content',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const expectedReturn = new CreatedComment({
        id: 'comment-123',
        content: 'a comment content',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const fakeIdGenerator = () => '123';
      const sut = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const actual = await sut.addComment(fakerPayload);

      // Assert
      expect(actual).toBeInstanceOf(CreatedComment);
      expect(actual).toStrictEqual(expectedReturn);
      const actualDb = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(actualDb).toHaveLength(1);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return array of comment from specific thread when found', async () => {
      // Arrange
      const fakerThreadId = 'thread-123';
      const expectedReturn = [
        {
          id: 'comment-234',
          username: 'albert',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          is_deleted: true,
        },
        {
          id: 'comment-123',
          username: 'albert',
          date: '2021-08-08T07:25:33.555Z',
          content: 'sebuah comment',
          is_deleted: false,
        },
      ];

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        userId: 'user-123',
        date: '2021-08-08T07:25:33.555Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-234',
        content: 'sebuah comment',
        threadId: 'thread-123',
        userId: 'user-123',
        date: '2021-08-08T07:22:33.555Z',
        isDeleted: true,
      });

      const sut = new CommentRepositoryPostgres(pool, {});

      // Act
      const actual = await sut.getCommentByThreadId(fakerThreadId);

      // Assert
      expect(actual).toStrictEqual(expectedReturn);
    });
  });

  describe('checkCommentAvailability function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const fakerCommentId = 'comment-123';
      const fakerThreadId = 'thread-123';
      const sut = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(sut.checkCommentAvailability(fakerCommentId, fakerThreadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      const fakerCommentId = 'comment-123';
      const fakerThreadId = 'thread-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const sut = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(sut.checkCommentAvailability(fakerCommentId, fakerThreadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('checkCommentOwner function', () => {
    it('should throw ForbiddenError when user is not the owner of comment', async () => {
      // Arrange
      const fakerCommentId = 'comment-123';
      const fakerUserId = 'user-123';

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'user-234' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ userId: 'user-234' });

      const sut = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(sut.checkCommentOwner(fakerCommentId, fakerUserId))
        .rejects.toThrow(ForbiddenError);
    });

    it('should not throw ForbiddenError when user is the owner of comment', async () => {
      // Arrange
      const fakerCommentId = 'comment-123';
      const fakerUserId = 'user-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const sut = new CommentRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(sut.checkCommentOwner(fakerCommentId, fakerUserId))
        .resolves.not.toThrow(ForbiddenError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      const fakerCommentId = 'comment-123';
      const sut = new CommentRepositoryPostgres(pool, {});

      // Act
      await sut.deleteCommentById(fakerCommentId);

      // Assert
      const actualDb = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(actualDb).toHaveLength(0);
    });
  });
});
