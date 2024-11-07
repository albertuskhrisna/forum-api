const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ForbiddenError = require('../../../Commons/exceptions/ForbiddenError');

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
    it('should persist comment to database', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'a comment content',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const sut = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      await sut.addComment(createComment);

      // Assert
      const addedThread = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(addedThread).toHaveLength(1);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return array of comment from specific thread when found', async () => {
      // Arrange
      const sut = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      const expectedComments = [
        {
          id: 'comment-234',
          username: 'albert',
          date: new Date('2021-08-08T07:22:33.555Z'),
          content: 'sebuah comment',
          is_deleted: true,
        },
        {
          id: 'comment-123',
          username: 'albert',
          date: new Date('2021-08-08T07:25:33.555Z'),
          content: 'sebuah comment',
          is_deleted: false,
        },
      ];

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
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

      // Act
      const actual = await sut.getCommentByThreadId(threadId);

      // Assert
      expect(actual).toStrictEqual(expectedComments);
    });
  });

  describe('checkCommentAvailability function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const sut = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      const threadId = 'thread-123';

      // Act & Assert
      await expect(sut.checkCommentAvailability(commentId, threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      const sut = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      const threadId = 'thread-123';
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });

      // Act & Assert
      await expect(sut.checkCommentAvailability(commentId, threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('checkCommentOwner function', () => {
    it('should throw ForbiddenError when user is not the owner of comment', async () => {
      // Arrange
      const sut = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      const userId = 'user-123';
      await CommentsTableTestHelper.addComment({ id: commentId, userId: 'user-234' });

      // Act & Assert
      await expect(sut.checkCommentOwner(commentId, userId))
        .rejects.toThrow(ForbiddenError);
    });

    it('should not throw ForbiddenError when user is the owner of comment', async () => {
      // Arrange
      const sut = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      const userId = 'user-123';
      await CommentsTableTestHelper.addComment({ id: commentId, userId });

      // Act & Assert
      await expect(sut.checkCommentOwner(commentId, userId))
        .resolves.not.toThrow(ForbiddenError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      const sut = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';

      // Act
      await sut.deleteCommentById(commentId);

      // Assert
      const findComment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(findComment).toHaveLength(0);
    });
  });
});
