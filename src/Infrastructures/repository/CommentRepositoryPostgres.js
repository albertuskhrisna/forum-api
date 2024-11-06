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
}

module.exports = CommentRepositoryPostgres;
