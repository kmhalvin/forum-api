const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies/{replyId}/likes endpoint', () => {
  beforeAll(async () => {
    const server = await createServer(container);
    // add user
    const userResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    const { data: user } = JSON.parse(userResponse.payload);
    // add thread
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      owner: user.addedUser.id,
    });
    // add comment & reply
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      owner: user.addedUser.id,
      threadId: 'thread-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'reply-123',
      owner: user.addedUser.id,
      threadId: 'thread-123',
      repliedTo: 'comment-123',
    });
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/replies/{replyId}/likes', () => {
    it('should response 200 when adding like', async () => {
      // Arrange
      const server = await createServer(container);
      // get auth
      const authReponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: auth } = JSON.parse(authReponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123/likes',
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when thread id not exists', async () => {
      // Arrange
      const server = await createServer(container);
      // get auth
      const authReponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: auth } = JSON.parse(authReponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-456/comments/comment-123/replies/reply-123/likes',
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment id not exists', async () => {
      // Arrange
      const server = await createServer(container);
      // get auth
      const authReponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: auth } = JSON.parse(authReponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-456/replies/reply-123/likes',
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 404 when reply id not exists', async () => {
      // Arrange
      const server = await createServer(container);
      // get auth
      const authReponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: auth } = JSON.parse(authReponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/replies/reply-456/likes',
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('balasan tidak ditemukan');
    });
  });
});
