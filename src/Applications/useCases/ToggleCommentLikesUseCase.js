const CommentLikes = require('../../Domains/commentLikes/entities/CommentLikes');

class ToggleCommentLikesUseCase {
  constructor({ commentRepository, commentLikesRepository }) {
    this._commentRepository = commentRepository;
    this._commentLikesRepository = commentLikesRepository;
  }

  async execute(userId, commentId, threadId) {
    const commentLikes = new CommentLikes({ commentId, userId });
    await this._commentRepository.checkCommentAvailability(commentId, threadId);

    const exist = await this._commentLikesRepository.checkCommentLikeAvailability(commentLikes);
    if (exist) {
      return this._commentLikesRepository.deleteLike(commentLikes);
    }

    return this._commentLikesRepository.addLike(commentLikes);
  }
}

module.exports = ToggleCommentLikesUseCase;
