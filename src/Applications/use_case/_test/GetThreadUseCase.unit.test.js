const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment');

describe('GetThreadUseCase', () => {
  it('should throw error if use case payload not contain thread id', async () => {
    // Arrange
    const useCasePayload = {};
    const getThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID');
  });

  it('should throw error if thread id not string', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
    };
    const getThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedGetThread = new Thread({
      id: useCasePayload.threadId,
      title: 'judul thread',
      body: 'body thread',
      date: new Date(),
      username: 'dicoding',
      comments: [],
    });

    const expectedGetThreadComments = [
      new Comment({
        id: 'comment-1222',
        username: 'dicoding',
        date: new Date(),
        replies: [],
        content: 'konten komentar',
        deleted: false,
        likeCount: 5,
      }),
      new Comment({
        id: 'comment-1230',
        username: 'dicoding2',
        date: new Date(),
        replies: [],
        content: 'konten komentar 2',
        deleted: false,
        likeCount: 1,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(expectedGetThread));
    mockCommentRepository.getCommentsWithRepliesByThreadId = jest.fn(
      () => Promise.resolve(expectedGetThreadComments),
    );

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread).toStrictEqual(new Thread({
      ...expectedGetThread,
      comments: expectedGetThreadComments,
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsWithRepliesByThreadId)
      .toBeCalledWith(useCasePayload.threadId);
  });
});
