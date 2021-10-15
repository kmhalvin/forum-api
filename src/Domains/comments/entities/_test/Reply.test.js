const Reply = require('../Reply');

describe('a Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-id',
      username: 'dicoding',
    };

    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-id',
      username: 'dicoding',
      date: '2011-10-05T14:48:00',
      content: 2011,
      deleted: false,
    };

    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    const payload = {
      id: 'reply-id',
      username: 'dicoding',
      date: new Date(),
      content: 'ini konten balasan',
      deleted: false,
    };

    const {
      id,
      username,
      date,
      content,
    } = new Reply(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('should create reply object correctly when deleted', () => {
    const payload = {
      id: 'reply-id',
      username: 'dicoding',
      date: new Date(),
      content: 'ini konten balasan',
      deleted: true,
    };

    const {
      id,
      username,
      date,
      content,
    } = new Reply(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**balasan telah dihapus**');
  });
});
