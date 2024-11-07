class DeleteReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(replyId, commentId, threadId, userId) {
    await this._commentRepository.checkCommentAvailability(commentId, threadId);
    await this._replyRepository.checkReplyAvailability(replyId, commentId);
    await this._replyRepository.checkReplyOwner(replyId, userId);
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
