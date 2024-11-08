const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ForbiddenError = require('../../../Commons/exceptions/ForbiddenError');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist reply to database', async () => {
      // Arrange
      const createReply = new CreateReply({
        content: 'a reply content',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const sut = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const actual = await sut.addReply(createReply);

      // Assert
      expect(actual).toBeInstanceOf(CreatedReply);
      expect(actual.id).toEqual('reply-123');
      expect(actual.content).toEqual('a reply content');
      expect(actual.owner).toEqual('user-123');
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return array of replies from specific comment when found', async () => {
      // Arrange
      const sut = new ReplyRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      const expectedReplies = [
        {
          id: 'reply-234',
          username: 'albert',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah reply',
          is_deleted: true,
        },
        {
          id: 'reply-123',
          username: 'albert',
          date: '2021-08-08T07:25:33.555Z',
          content: 'sebuah reply',
          is_deleted: false,
        },
      ];

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        commentId: 'comment-123',
        userId: 'user-123',
        date: '2021-08-08T07:25:33.555Z',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-234',
        content: 'sebuah reply',
        commentId: 'comment-123',
        userId: 'user-123',
        date: '2021-08-08T07:22:33.555Z',
        isDeleted: true,
      });

      // Act
      const actual = await sut.getRepliesByCommentId(commentId);

      // Assert
      expect(actual).toStrictEqual(expectedReplies);
    });
  });

  describe('checkReplyAvailability function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const sut = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';
      const commentId = 'comment-123';

      // Act & Assert
      await expect(sut.checkReplyAvailability(replyId, commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      const sut = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';
      const commentId = 'comment-123';
      await RepliesTableTestHelper.addReply({ id: replyId, commentId });

      // Act & Assert
      await expect(sut.checkReplyAvailability(replyId, commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('checkReplyOwner function', () => {
    it('should throw ForbiddenError when user is not the owner of reply', async () => {
      // Arrange
      const sut = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';
      const userId = 'user-123';
      await RepliesTableTestHelper.addReply({ id: replyId, userId: 'user-234' });

      // Act & Assert
      await expect(sut.checkReplyOwner(replyId, userId))
        .rejects.toThrow(ForbiddenError);
    });

    it('should not throw ForbiddenError when user is the owner of reply', async () => {
      // Arrange
      const sut = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';
      const userId = 'user-123';
      await RepliesTableTestHelper.addReply({ id: replyId, userId });

      // Act & Assert
      await expect(sut.checkReplyOwner(replyId, userId))
        .resolves.not.toThrow(ForbiddenError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      const sut = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';

      // Act
      await sut.deleteReplyById(replyId);

      // Assert
      const findReply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(findReply).toHaveLength(0);
    });
  });
});
