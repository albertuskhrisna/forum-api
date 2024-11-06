const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
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
});
