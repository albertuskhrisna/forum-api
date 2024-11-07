class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const commentsDb = await this._commentRepository.getCommentByThreadId(threadId);

    const comments = [];
    for (const comment of commentsDb) {
      const replies = [];
      const repliesDb = await this._replyRepository.getRepliesByCommentId(comment.id);
      repliesDb.map((reply) => replies.push({
        id: reply.id,
        content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
        date: reply.date.toISOString(),
        username: reply.username,
      }));

      comments.push({
        id: comment.id,
        username: comment.username,
        date: comment.date.toISOString(),
        replies,
        content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
      });
    }

    return {
      ...thread,
      comments,
    };
  }
}

module.exports = GetThreadDetailUseCase;
