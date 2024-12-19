const ICommentLikesRepository = require('../../Domains/commentLikes/ICommentLikesRepository');

class ReplyRepositoryPostgres extends ICommentLikesRepository {
  constructor(pool) {
    super();

    this._pool = pool;
  }

  async addLike(commentLikes) {
    const { commentId, userId } = commentLikes;
    const query = {
      text: `INSERT INTO comment_likes (comment_id, user_id)
        VALUES($1, $2) RETURNING comment_id, user_id`,
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async getLikesCountByCommentIds(commentIds) {
    const query = {
      text: `SELECT comment_id, COUNT(*)::int AS like_count
        FROM comment_likes
        WHERE comment_likes.comment_id = ANY($1::text[])
        GROUP BY comment_id`,
      values: [commentIds],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkCommentLikeAvailability(commentLikes) {
    const { commentId, userId } = commentLikes;
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return false;
    }
    return true;
  }

  async deleteLike(commentLikes) {
    const { commentId, userId } = commentLikes;
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
