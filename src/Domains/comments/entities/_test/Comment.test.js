const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-id',
      username: 'dicoding',
      likeCount: 0,
    };

    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-id',
      username: 'dicoding',
      date: '2011-10-05T14:48:00',
      replies: [],
      content: 2011,
      deleted: null,
      likeCount: '0',
    };

    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    const payload = {
      id: 'comment-id',
      username: 'dicoding',
      date: new Date(),
      replies: [],
      content: 'ini konten komentar',
      deleted: false,
      likeCount: 0,
    };

    const {
      id,
      username,
      date,
      replies,
      content,
      likeCount,
    } = new Comment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(content).toEqual(payload.content);
    expect(likeCount).toEqual(payload.likeCount);
  });

  it('should create comment object correctly when deleted', () => {
    const payload = {
      id: 'comment-id',
      username: 'dicoding',
      date: new Date(),
      replies: [],
      content: 'ini konten komentar',
      deleted: true,
      likeCount: 1,
    };

    const {
      id,
      username,
      date,
      replies,
      content,
      likeCount,
    } = new Comment(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(likeCount).toEqual(payload.likeCount);
    expect(content).toEqual('**komentar telah dihapus**');
  });
});
