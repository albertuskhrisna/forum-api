class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const commentsDb = await this._commentRepository.getCommentByThreadId(threadId);

    const comments = [];
    commentsDb.map((comment) => comments.push({
      id: comment.id,
      username: comment.username,
      date: comment.date.toString(),
      content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
    }));

    return {
      ...thread,
      comments,
    };
  }
}

module.exports = GetThreadDetailUseCase;
