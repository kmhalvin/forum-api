const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'defaultuser 1',
    });
    await UsersTableTestHelper.addUser({
      id: 'user-456',
      username: 'defaultuser 2',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'comment on this thread! (test)',
      body: 'default thread for comment testing!',
      owner: 'user-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLike', () => {
    it('should persist add like', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike('user-123', 'comment-123');

      // Assert
      const comments = await LikesTableTestHelper.findLikeById('like-123');
      expect(comments).toHaveLength(1);
    });
  });

  describe('getLikeIdByOwnerAndCommentId', () => {
    it('should return null when not available', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(likeRepositoryPostgres.getLikeIdByOwnerAndCommentId('user-123', 'comment-456'))
        .resolves.toEqual(null);
    });

    it('should return like id when available', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(likeRepositoryPostgres.getLikeIdByOwnerAndCommentId('user-123', 'comment-123'))
        .resolves.toEqual('like-123');
    });
  });

  describe('deleteLikeById', () => {
    it('should delete like by id from database', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLikeById('like-123');

      // Assert
      const likes = await LikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(0);
    });
  });
});
