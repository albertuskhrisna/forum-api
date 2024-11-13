const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
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
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist reply to database and return CreatedReply entity', async () => {
      // Arrange
      const fakerPayload = new CreateReply({
        content: 'a reply content',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const expectedReturn = new CreatedReply({
        id: 'reply-123',
        content: 'a reply content',
        owner: 'user-123',
      });

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';
      const sut = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const actual = await sut.addReply(fakerPayload);

      // Assert
      expect(actual).toBeInstanceOf(CreatedReply);
      expect(actual).toStrictEqual(expectedReturn);
      const actualDb = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(actualDb).toHaveLength(1);
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should return array of replies from any comments when found', async () => {
      // Arrange
      const fakerCommentIds = ['comment-123'];
      const expectedReturn = [
        {
          id: 'reply-234',
          username: 'albert',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah reply',
          is_deleted: true,
          comment_id: 'comment-123',
        },
        {
          id: 'reply-123',
          username: 'albert',
          date: '2021-08-08T07:25:33.555Z',
          content: 'sebuah reply',
          is_deleted: false,
          comment_id: 'comment-123',
        },
      ];

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
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

      const sut = new ReplyRepositoryPostgres(pool, {});

      // Act
      const actual = await sut.getRepliesByCommentIds(fakerCommentIds);

      // Assert
      expect(actual).toStrictEqual(expectedReturn);
    });
  });

  describe('checkReplyAvailability function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const fakerReplyId = 'reply-123';
      const fakerCommentId = 'comment-123';
      const sut = new ReplyRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(sut.checkReplyAvailability(fakerReplyId, fakerCommentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      const fakerReplyId = 'reply-123';
      const fakerCommentId = 'comment-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const sut = new ReplyRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(sut.checkReplyAvailability(fakerReplyId, fakerCommentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('checkReplyOwner function', () => {
    it('should throw ForbiddenError when user is not the owner of reply', async () => {
      // Arrange
      const fakerReplyId = 'reply-123';
      const fakerUserId = 'user-123';

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'user-234' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({ userId: 'user-234' });

      const sut = new ReplyRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(sut.checkReplyOwner(fakerReplyId, fakerUserId))
        .rejects.toThrow(ForbiddenError);
    });

    it('should not throw ForbiddenError when user is the owner of reply', async () => {
      // Arrange
      const fakerReplyId = 'reply-123';
      const fakerUserId = 'user-123';

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const sut = new ReplyRepositoryPostgres(pool, {});

      // Act & Assert
      await expect(sut.checkReplyOwner(fakerReplyId, fakerUserId))
        .resolves.not.toThrow(ForbiddenError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      const fakerReplyId = 'reply-123';
      const sut = new ReplyRepositoryPostgres(pool, {});

      // Act
      await sut.deleteReplyById(fakerReplyId);

      // Assert
      const actualDb = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(actualDb).toHaveLength(0);
    });
  });
});
