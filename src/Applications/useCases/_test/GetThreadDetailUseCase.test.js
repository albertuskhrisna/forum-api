const IThreadRepository = require('../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../Domains/comments/ICommentRepository');
const IReplyRepository = require('../../../Domains/replies/IReplyRepository');
const ICommentLikesRepository = require('../../../Domains/commentLikes/ICommentLikesRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const RetrievedThread = require('../../../Domains/threads/entities/RetrievedThread');
const RetrievedComment = require('../../../Domains/comments/entities/RetrievedComment');
const RetrievedReply = require('../../../Domains/replies/entities/RetrievedReply');

describe('Get Thread Detail use case', () => {
  it('should return detail of a thread correctly', async () => {
    // Arrange
    const fakerThreadDb = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'albert',
    };

    const fakerCommentDb = [
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

    const fakerReplyDb = [
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

    const fakerCommentLikesDb = [
      {
        comment_id: 'comment-123',
        like_count: 10,
      },
      {
        comment_id: 'comment-234',
        like_count: 10,
      },
    ];

    const expectedReturn = new RetrievedThread({
      id: fakerThreadDb.id,
      title: fakerThreadDb.title,
      body: fakerThreadDb.body,
      date: fakerThreadDb.date,
      username: fakerThreadDb.username,
      comments: [
        new RetrievedComment({
          id: fakerCommentDb[0].id,
          username: fakerCommentDb[0].username,
          date: fakerCommentDb[0].date,
          content: fakerCommentDb[0].content,
          isDeleted: fakerCommentDb[0].is_deleted,
          replies: [
            new RetrievedReply({
              id: fakerReplyDb[0].id,
              content: fakerReplyDb[0].content,
              date: fakerReplyDb[0].date,
              username: fakerReplyDb[0].username,
              isDeleted: fakerReplyDb[0].is_deleted,
            }),
          ],
          likeCount: 10,
        }),
        new RetrievedComment({
          id: fakerCommentDb[1].id,
          username: fakerCommentDb[1].username,
          date: fakerCommentDb[1].date,
          content: fakerCommentDb[1].content,
          isDeleted: fakerCommentDb[1].is_deleted,
          replies: [
            new RetrievedReply({
              id: fakerReplyDb[1].id,
              content: fakerReplyDb[1].content,
              date: fakerReplyDb[1].date,
              username: fakerReplyDb[1].username,
              isDeleted: fakerReplyDb[1].is_deleted,
            }),
          ],
          likeCount: 10,
        }),
      ],
    });

    const mockThreadRepository = new IThreadRepository();
    const mockCommentRepository = new ICommentRepository();
    const mockReplyRepository = new IReplyRepository();
    const mockCommentLikesRepository = new ICommentLikesRepository();
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(fakerThreadDb));
    mockCommentRepository.getCommentByThreadId = jest.fn(() => Promise.resolve(fakerCommentDb));
    mockReplyRepository.getRepliesByCommentIds = jest.fn(() => Promise.resolve(fakerReplyDb));
    mockCommentLikesRepository.getLikesCountByCommentIds = jest.fn(() => Promise.resolve(fakerCommentLikesDb));

    const sut = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikesRepository: mockCommentLikesRepository,
    });

    // Act
    const actual = await sut.execute('thread-123');

    // Assert
    expect(actual).toStrictEqual(expectedReturn);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith('thread-123');
    expect(mockReplyRepository.getRepliesByCommentIds).toHaveBeenCalledWith(['comment-123', 'comment-234']);
    expect(mockCommentLikesRepository.getLikesCountByCommentIds).toHaveBeenCalledWith(['comment-123', 'comment-234']);
  });
});
