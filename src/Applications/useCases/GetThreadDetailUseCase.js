const RetrievedThread = require('../../Domains/threads/entities/RetrievedThread');
const RetrievedComment = require('../../Domains/comments/entities/RetrievedComment');
const RetrievedReply = require('../../Domains/replies/entities/RetrievedReply');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const commentsDb = await this._commentRepository.getCommentByThreadId(threadId);
    const commentIds = commentsDb.map(({ id }) => id);
    const repliesDb = await this._replyRepository.getRepliesByCommentIds(commentIds);

    const comments = commentsDb.map((comment) => {
      const replies = repliesDb
        .filter((item) => item.comment_id === comment.id)
        .map((item) => new RetrievedReply({ ...item, isDeleted: item.is_deleted }));

      return new RetrievedComment({ ...comment, isDeleted: comment.is_deleted, replies });
    });

    return new RetrievedThread({ ...thread, comments });
  }
}

module.exports = GetThreadDetailUseCase;
