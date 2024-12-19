const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikesRepositoryPostgres = require('../CommentLikesRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ForbiddenError = require('../../../Commons/exceptions/ForbiddenError');
const CommentLikes = require('../../../Domains/commentLikes/entities/CommentLikes');

describe('CommentLikesRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist like to database', async () => {
      // Arrange
      const fakerPayload = new CommentLikes({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const sut = new CommentLikesRepositoryPostgres(pool);

      // Act
      await sut.addLike(fakerPayload);

      // Assert
      const actualDb = await CommentLikesTableTestHelper.findLikes('comment-123', 'user-123');
      expect(actualDb).toHaveLength(1);
    });
  });

  describe('getLikesCountByCommentIds function', () => {
    it('should return count of like from any comments when found', async () => {
      // Arrange
      const fakerCommentIds = ['comment-123', 'comment-234'];
      const expectedReturn = [
        {
          comment_id: 'comment-123',
          like_count: 2,
        },
        {
          comment_id: 'comment-234',
          like_count: 1,
        },
      ];

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'khrisna' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({ id: 'comment-234', userId: 'user-234' });
      await CommentLikesTableTestHelper.addLikes({
        commentId: 'comment-123',
        userId: 'user-123',
      });
      await CommentLikesTableTestHelper.addLikes({
        commentId: 'comment-123',
        userId: 'user-234',
      });
      await CommentLikesTableTestHelper.addLikes({
        commentId: 'comment-234',
        userId: 'user-123',
      });

      const sut = new CommentLikesRepositoryPostgres(pool);

      // Act
      const actual = await sut.getLikesCountByCommentIds(fakerCommentIds);

      // Assert
      expect(actual).toStrictEqual(expectedReturn);
    });
  });

  describe('checkCommentLikeAvailability function', () => {
    it('should return false when comment like not found', async () => {
      // Arrange
      const fakerPayload = new CommentLikes({
        commentId: 'comment-123',
        userId: 'user-123',
      });
      const sut = new CommentLikesRepositoryPostgres(pool);

      // Act
      const actual = await sut.checkCommentLikeAvailability(fakerPayload);

      // Assert
      expect(actual).toBe(false);
    });

    it('should return true when comment like found', async () => {
      // Arrange
      const fakerPayload = new CommentLikes({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentLikesTableTestHelper.addLikes({});

      const sut = new CommentLikesRepositoryPostgres(pool);

      // Act
      const actual = await sut.checkCommentLikeAvailability(fakerPayload);

      // Assert
      expect(actual).toBe(true);
    });
  });

  describe('deleteLike function', () => {
    it('should delete comment like from database', async () => {
      // Arrange
      const fakerPayload = new CommentLikes({
        commentId: 'comment-123',
        userId: 'user-123',
      });
      const sut = new CommentLikesRepositoryPostgres(pool);

      // Act
      await sut.deleteLike(fakerPayload);

      // Assert
      const actualDb = await CommentLikesTableTestHelper.findLikes(fakerPayload);
      expect(actualDb).toHaveLength(0);
    });
  });
});
