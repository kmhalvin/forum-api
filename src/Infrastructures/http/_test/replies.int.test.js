const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
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
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and new reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'hey, first reply!',
      };
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
      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: { content: 'hey, first comment!' },
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });
      const { data: comment } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies`,
        payload: requestPayload,
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 404 when thread id not exists', async () => {
      // Arrange
      const requestPayload = {
        content: 'hey, first comment!',
      };
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
        method: 'POST',
        url: '/threads/thread-456/comments/comment-123/replies',
        payload: requestPayload,
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
      const requestPayload = {
        content: 'hey, first comment!',
      };
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
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
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
      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: { content: 'hey, first comment!' },
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });
      const { data: comment } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies`,
        payload: requestPayload,
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 if reply deleted successfuly', async () => {
      // Arrange
      const requestPayload = {
        content: 'hey, first reply!',
      };
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
      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: { content: 'hey, first comment!' },
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });
      const { data: comment } = JSON.parse(commentResponse.payload);
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies`,
        payload: requestPayload,
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });
      const { data: reply } = JSON.parse(replyResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies/${reply.addedReply.id}`,
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      const [deletedReply] = await CommentsTableTestHelper
        .findCommentsById(reply.addedReply.id);
      expect(deletedReply.is_delete).toEqual(true);
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
        method: 'DELETE',
        url: '/threads/thread-456/comments/comment-123/replies/reply-123',
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
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
      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: { content: 'hey, first comment!' },
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });
      const { data: comment } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/${comment.addedComment.id}/replies/reply-123`,
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should response 403 if reply forbidden', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding 2' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-456' });
      await CommentsTableTestHelper.addComment({
        id: 'reply-123', threadId: 'thread-123', owner: 'user-456', repliedTo: 'comment-123',
      });
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: { authorization: `Bearer ${auth.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses resource ini');
    });
  });
});
