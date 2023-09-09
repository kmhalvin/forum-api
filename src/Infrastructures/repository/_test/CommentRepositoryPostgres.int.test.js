const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/comments/entities/Reply');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddReply = require('../../../Domains/comments/entities/AddReply');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
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
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: addComment.owner,
      }));
    });
  });

  describe('addReply', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      const addReply = new AddReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'hello, test reply the test comment',
        owner: 'user-456',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addReply(addReply);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('reply-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'hello, test comment',
        owner: 'user-123',
      });
      const addReply = new AddReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'hello, test reply the test comment',
        owner: 'user-456',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'reply-123',
        content: addReply.content,
        owner: addReply.owner,
      }));
    });
  });

  describe('getCommentsWithRepliesByThreadId', () => {
    it('should return empty array when not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.getCommentsWithRepliesByThreadId('thread-123'))
        .resolves.toEqual([]);
    });

    it('should return thread comments and replies when available', async () => {
      // Arrange
      const date1 = new Date();
      date1.setMinutes(10);
      const date2 = new Date();
      date2.setMinutes(20);
      const date3 = new Date();
      date3.setMinutes(30);
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'hello, test comment.',
        owner: 'user-123',
        date: date1,
        isDelete: true,
      });
      await CommentsTableTestHelper.addComment({
        id: 'reply-123',
        threadId: 'thread-123',
        content: 'hello, test reply the test comment',
        owner: 'user-456',
        repliedTo: 'comment-123',
        date: date2,
        isDelete: true,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        threadId: 'thread-123',
        content: 'hello, test comment again.',
        owner: 'user-456',
        date: date3,
      });
      await CommentsTableTestHelper.addComment({
        id: 'reply-456',
        threadId: 'thread-123',
        content: 'thanks for the reply defaultuser 2!',
        owner: 'user-123',
        repliedTo: 'comment-123',
        date: date3,
      });
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        commentId: 'comment-456',
        owner: 'user-123',
      });
      await LikesTableTestHelper.addLike({
        id: 'like-456',
        commentId: 'reply-456',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      const comments = await commentRepositoryPostgres.getCommentsWithRepliesByThreadId('thread-123');
      expect(comments).toStrictEqual([
        new Comment({
          id: 'comment-123',
          username: 'defaultuser 1',
          date: date1,
          replies: [
            new Reply({
              id: 'reply-123',
              username: 'defaultuser 2',
              date: date2,
              content: '**balasan telah dihapus**',
              deleted: true,
              likeCount: 0,
            }),
            new Reply({
              id: 'reply-456',
              username: 'defaultuser 1',
              date: date3,
              content: 'thanks for the reply defaultuser 2!',
              deleted: false,
              likeCount: 1,
            }),
          ],
          content: '**komentar telah dihapus**',
          deleted: true,
          likeCount: 0,
        }),
        new Comment({
          id: 'comment-456',
          username: 'defaultuser 2',
          date: date3,
          replies: [],
          content: 'hello, test comment again.',
          deleted: false,
          likeCount: 1,
        }),
      ]);
    });
  });

  describe('verifyAvailableComment', () => {
    it('should throw NotFoundError when comment not available', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyAvailableComment('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyAvailableReply', () => {
    it('should throw NotFoundError when reply not available', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyAvailableReply('reply-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'reply-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableReply('reply-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw NotFoundError when comment / reply not available', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyCommentOwner('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment / reply forbidden', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment / reply not forbidden', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById', () => {
    it('should throw NotFoundError when comment not available', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.deleteCommentById('thread-123', 'comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should soft delete comment by id from database', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('thread-123', 'comment-123');

      // Assert
      const [comment] = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comment.is_delete).toEqual(true);
    });
  });

  describe('deleteReplyById', () => {
    it('should throw NotFoundError when reply not available', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.deleteReplyById('thread-123', 'comment-123', 'reply-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should soft delete reply by id from database', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'reply-123',
        threadId: 'thread-123',
        repliedTo: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteReplyById('thread-123', 'comment-123', 'reply-123');

      // Assert
      const [comment] = await CommentsTableTestHelper.findCommentsById('reply-123');
      expect(comment.is_delete).toEqual(true);
    });
  });
});
