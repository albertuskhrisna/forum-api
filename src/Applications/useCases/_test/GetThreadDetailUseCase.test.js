const IThreadRepository = require('../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../Domains/comments/ICommentRepository');
const IReplyRepository = require('../../../Domains/replies/IReplyRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const RetrievedThread = require('../../../Domains/threads/entities/RetrievedThread');
const RetrievedComment = require('../../../Domains/comments/entities/RetrievedComment');
const RetrievedReply = require('../../../Domains/replies/entities/RetrievedReply');

describe('Get Thread Detail use case', () => {
  it('should return detail of a thread correctly', async () => {
    // Arrange
    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'albert',
    };

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_deleted: false,
      },
      {
        id: 'comment-234',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_deleted: true,
      },
    ];

    const expectedReplies = [
      {
        id: 'reply-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah reply',
        is_deleted: false,
        comment_id: 'comment-123',
      },
      {
        id: 'reply-234',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah reply',
        is_deleted: true,
        comment_id: 'comment-234',
      },
    ];

    const mockThreadRepository = new IThreadRepository();
    const mockCommentRepository = new ICommentRepository();
    const mockReplyRepository = new IReplyRepository();
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentByThreadId = jest.fn(() => Promise.resolve(expectedComment));
    mockReplyRepository.getRepliesByCommentIds = jest.fn(() => Promise.resolve(expectedReplies));

    const sut = new GetThreadDetailUseCase({ threadRepository: mockThreadRepository, commentRepository: mockCommentRepository, replyRepository: mockReplyRepository });

    // Act
    const actual = await sut.execute('thread-123');

    // Assert
    expect(actual).toStrictEqual(new RetrievedThread({
      id: expectedThread.id,
      title: expectedThread.title,
      body: expectedThread.body,
      date: expectedThread.date,
      username: expectedThread.username,
      comments: [
        new RetrievedComment({
          id: expectedComment[0].id,
          username: expectedComment[0].username,
          date: expectedComment[0].date,
          content: expectedComment[0].content,
          isDeleted: expectedComment[0].is_deleted,
          replies: [
            new RetrievedReply({
              id: expectedReplies[0].id,
              content: expectedReplies[0].content,
              date: expectedReplies[0].date,
              username: expectedReplies[0].username,
              isDeleted: expectedReplies[0].is_deleted,
            }),
          ],
        }),
        new RetrievedComment({
          id: expectedComment[1].id,
          username: expectedComment[1].username,
          date: expectedComment[1].date,
          content: expectedComment[1].content,
          isDeleted: expectedComment[1].is_deleted,
          replies: [
            new RetrievedReply({
              id: expectedReplies[1].id,
              content: expectedReplies[1].content,
              date: expectedReplies[1].date,
              username: expectedReplies[1].username,
              isDeleted: expectedReplies[1].is_deleted,
            }),
          ],
        }),
      ],
    }));

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith('thread-123');
    expect(mockReplyRepository.getRepliesByCommentIds).toHaveBeenCalledWith(['comment-123', 'comment-234']);
  });
});
