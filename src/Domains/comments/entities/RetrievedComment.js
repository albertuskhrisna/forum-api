class RetrievedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isDeleted, replies, likeCount,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
    this.replies = replies;
    this.likeCount = likeCount;
  }

  _verifyPayload({
    id, username, date, content, isDeleted, replies, likeCount,
  }) {
    if (!id || !username || !date || !content || isDeleted === undefined || replies === undefined) {
      throw new Error('RETRIEVED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
      || typeof isDeleted !== 'boolean'
      || !Array.isArray(replies)
      || typeof likeCount !== 'number') {
      throw new Error('RETRIEVED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RetrievedComment;
