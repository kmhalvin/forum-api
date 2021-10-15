class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      threadId,
      commentId,
      content,
      owner,
    } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({
    threadId,
    commentId,
    content,
    owner,
  }) {
    if (!threadId || !commentId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_LOCATION');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('ADD_REPLY.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!content || !owner) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
