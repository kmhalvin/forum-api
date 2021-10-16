const LikeReplyUseCase = require('../LikeReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('LikeReplyUseCase', () => {
  it('should throw error if use case payload not contain payload', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const likeReplyUseCase = new LikeReplyUseCase({}, {}, {});

    // Action & Assert
    await expect(likeReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
  });

  it('should throw error if payload not meet data type', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
      commentId: 999,
      replyId: 456,
      owner: 'user-123',
    };
    const likeReplyUseCase = new LikeReplyUseCase({}, {}, {});

    // Action & Assert
    await expect(likeReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the like reply action correctly when adding like', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-1321',
      replyId: 'reply-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve);
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableReply = jest.fn(() => Promise.resolve());
    const mockLikeRepository = new LikeRepository();
    mockLikeRepository.getLikeIdByOwnerAndCommentId = jest.fn(() => Promise.resolve(null));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    const likeReplyUseCase = new LikeReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyAvailableReply)
      .toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockLikeRepository.getLikeIdByOwnerAndCommentId)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.replyId);
    expect(mockLikeRepository.addLike)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.replyId);
  });

  it('should orchestrating the like reply action correctly when removing like', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-1321',
      replyId: 'reply-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve);
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableReply = jest.fn(() => Promise.resolve());
    const mockLikeRepository = new LikeRepository();
    mockLikeRepository.getLikeIdByOwnerAndCommentId = jest.fn(() => Promise.resolve('like-123'));
    mockLikeRepository.deleteLikeById = jest.fn(() => Promise.resolve());

    const likeReplyUseCase = new LikeReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyAvailableReply)
      .toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockLikeRepository.getLikeIdByOwnerAndCommentId)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.replyId);
    expect(mockLikeRepository.deleteLikeById)
      .toHaveBeenCalledWith('like-123');
  });
});
