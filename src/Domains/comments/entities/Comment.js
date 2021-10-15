class Comment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id,
      username,
      date,
      replies,
      content,
      deleted,
      likeCount,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.likeCount = likeCount;
    this.content = deleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({
    id,
    username,
    date,
    replies,
    content,
    deleted,
    likeCount,
  }) {
    if (
      !id
      || !username
      || !date
      || !replies
      || !content
      || typeof deleted === 'undefined'
      || typeof likeCount === 'undefined') {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || !(date instanceof Date)
      || !Array.isArray(replies)
      || typeof content !== 'string'
      || typeof deleted !== 'boolean'
      || typeof likeCount !== 'number'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
