class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      threadId,
      content,
      owner,
    } = payload;

    this.threadId = threadId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({
    threadId,
    content,
    owner,
  }) {
    if (!threadId) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_LOCATION');
    }

    if (typeof threadId !== 'string') {
      throw new Error('ADD_COMMENT.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!content || !owner) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
