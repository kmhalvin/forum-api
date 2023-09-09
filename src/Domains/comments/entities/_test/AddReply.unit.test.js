const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: 'thread-132',
      commentId: 'comment-123',
      content: 'ini konten reply',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-321',
      content: 2011,
      owner: 123,
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain thread id and comment id', () => {
    const payload = {
      commentId: 'comment-123',
      content: 'ini konten komen',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_LOCATION');
  });

  it('should throw error when thread id or comment id did not meet data type specification', () => {
    const payload = {
      threadId: 12,
      commentId: 12335,
      content: 'ini konten komen',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addReply object correctly', () => {
    const payload = {
      threadId: 'thread-id',
      commentId: 'comment-id',
      content: 'ini konten reply',
      owner: 'user-123',
    };

    const {
      threadId,
      commentId,
      content,
      owner,
    } = new AddReply(payload);

    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
