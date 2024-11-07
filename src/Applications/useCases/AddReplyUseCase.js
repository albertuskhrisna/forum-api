const CreateReply = require('../../Domains/replies/entities/CreateReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(userId, commentId, threadId, payload) {
    const createReply = new CreateReply({ ...payload, commentId, owner: userId });
    await this._commentRepository.checkCommentAvailability(commentId, threadId);
    return this._replyRepository.addReply(createReply);
  }
}

module.exports = AddReplyUseCase;
