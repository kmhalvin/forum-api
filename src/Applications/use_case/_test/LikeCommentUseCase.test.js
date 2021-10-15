const LikeCommentUseCase = require('../LikeCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('LikeCommentUseCase', () => {
  it('should throw error if use case payload not contain payload', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const likeCommentUseCase = new LikeCommentUseCase({}, {}, {});

    // Action & Assert
    await expect(likeCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
  });

  it('should throw error if payload not meet data type', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
      commentId: 999,
      owner: 'user-123',
    };
    const likeCommentUseCase = new LikeCommentUseCase({}, {}, {});

    // Action & Assert
    await expect(likeCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the like comment action correctly when adding like', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-1321',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve);
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    const mockLikeRepository = new LikeRepository();
    mockLikeRepository.getLikeIdByOwnerAndCommentId = jest.fn(() => Promise.resolve(null));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.getLikeIdByOwnerAndCommentId)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.commentId);
    expect(mockLikeRepository.addLike)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.commentId);
  });

  it('should orchestrating the like comment action correctly when removing like', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-1321',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve);
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    const mockLikeRepository = new LikeRepository();
    mockLikeRepository.getLikeIdByOwnerAndCommentId = jest.fn(() => Promise.resolve('like-123'));
    mockLikeRepository.deleteLikeById = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.getLikeIdByOwnerAndCommentId)
      .toHaveBeenCalledWith(useCasePayload.owner, useCasePayload.commentId);
    expect(mockLikeRepository.deleteLikeById)
      .toHaveBeenCalledWith('like-123');
  });
});
