const CreateComment = require('../../Domains/comments/entities/CreateComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, payload) {
    const createComment = new CreateComment({ ...payload, threadId, owner: userId });
    await this._threadRepository.checkThreadAvailability(threadId);
    return this._commentRepository.addComment(createComment);
  }
}

module.exports = AddCommentUseCase;
