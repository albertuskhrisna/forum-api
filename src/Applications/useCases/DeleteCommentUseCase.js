class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(commentId, threadId, userId) {
    await this._commentRepository.checkCommentAvailability(commentId, threadId);
    await this._commentRepository.checkCommentOwner(commentId, userId);
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
