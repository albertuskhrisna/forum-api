const ForbiddenError = require('../../Commons/exceptions/ForbiddenError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const ICommentRepository = require('../../Domains/comments/ICommentRepository');

class CommentRepositoryPostgres extends ICommentRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(createComment) {
    const { content, threadId, owner } = createComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner_id',
      values: [id, content, date, threadId, owner],
    };

    const result = await this._pool.query(query);
    const newComment = result.rows[0];
    return new CreatedComment({
      id: newComment.id,
      content: newComment.content,
      owner: newComment.owner_id,
    });
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, timezone('UTC', comments.date) AS date, 
        comments.is_deleted, users.username FROM comments JOIN users ON comments.owner_id = users.id
        WHERE comments.thread_id = $1 ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkCommentAvailability(commentId, threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2 AND is_deleted = FALSE',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan di database');
    }
  }

  async checkCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner_id = $2 AND is_deleted = FALSE',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new ForbiddenError('komentar ini bukan milik anda');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1 AND is_deleted = FALSE',
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
