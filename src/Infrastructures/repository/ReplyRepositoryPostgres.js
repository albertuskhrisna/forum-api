const ForbiddenError = require('../../Commons/exceptions/ForbiddenError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');
const IReplyRepository = require('../../Domains/replies/IReplyRepository');

class ReplyRepositoryPostgres extends IReplyRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(createReply) {
    const { content, commentId, owner } = createReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner_id',
      values: [id, content, date, commentId, owner],
    };

    const result = await this._pool.query(query);
    const newReply = result.rows[0];
    return new CreatedReply({
      id: newReply.id,
      content: newReply.content,
      owner: newReply.owner_id,
    });
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT replies.id, replies.content, timezone('UTC', replies.date) AS date, 
        replies.is_deleted, users.username FROM replies JOIN users ON replies.owner_id = users.id
        WHERE replies.comment_id = $1 ORDER BY date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkReplyAvailability(replyId, commentId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND comment_id = $2 AND is_deleted = FALSE',
      values: [replyId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('balasan komentar tidak ditemukan di database');
    }
  }

  async checkReplyOwner(replyId, userId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner_id = $2 AND is_deleted = FALSE',
      values: [replyId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new ForbiddenError('balasan komentar ini bukan milik anda');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1 AND is_deleted = FALSE',
      values: [replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
