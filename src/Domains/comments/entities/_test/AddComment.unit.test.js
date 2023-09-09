const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
      content: 'ini konten komen',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 'thread-id',
      content: 2011,
      owner: 123,
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain thread id', () => {
    const payload = {
      content: 'ini konten komen',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_LOCATION');
  });

  it('should throw error when thread id did not meet data type specification', () => {
    const payload = {
      threadId: 12,
      content: 'ini konten komen',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.LOCATION_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    const payload = {
      threadId: 'thread-id',
      content: 'ini konten komentar',
      owner: 'user-123',
    };

    const {
      threadId,
      content,
      owner,
    } = new AddComment(payload);

    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
