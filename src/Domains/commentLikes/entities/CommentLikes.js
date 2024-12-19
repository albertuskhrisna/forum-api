class CommentLikes {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId, userId } = payload;
    this.commentId = commentId;
    this.userId = userId;
  }

  _verifyPayload({ commentId, userId }) {
    if (!commentId || !userId) {
      throw new Error('COMMENT_LIKES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('COMMENT_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentLikes;
