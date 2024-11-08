const IThreadRepository = require('../../../Domains/threads/IThreadRepository');
const ICommentRepository = require('../../../Domains/comments/ICommentRepository');
const IReplyRepository = require('../../../Domains/replies/IReplyRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

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
      },
      {
        id: 'reply-234',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah reply',
        is_deleted: true,
      },
    ];

    const mockThreadRepository = new IThreadRepository();
    const mockCommentRepository = new ICommentRepository();
    const mockReplyRepository = new IReplyRepository();
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));

    const sut = new GetThreadDetailUseCase({ threadRepository: mockThreadRepository, commentRepository: mockCommentRepository, replyRepository: mockReplyRepository });

    // Act
    const actual = await sut.execute('thread-123');

    // Assert
    expect(actual.id).toEqual('thread-123');
    expect(actual.title).toEqual('sebuah thread');
    expect(actual.body).toEqual('sebuah body thread');
    expect(actual.date).toEqual('2021-08-08T07:19:09.775Z');
    expect(actual.username).toEqual('albert');
    expect(actual.comments).toBeInstanceOf(Array);
    expect(actual.comments).toHaveLength(2);

    expect(actual.comments[0].id).toEqual('comment-123');
    expect(actual.comments[0].username).toEqual('johndoe');
    expect(actual.comments[0].date).toEqual('2021-08-08T07:22:33.555Z');
    expect(actual.comments[0].content).toEqual('sebuah comment');
    expect(actual.comments[0].replies).toBeInstanceOf(Array);
    expect(actual.comments[0].replies).toHaveLength(2);

    expect(actual.comments[0].replies[0].id).toEqual('reply-123');
    expect(actual.comments[0].replies[0].content).toEqual('sebuah reply');
    expect(actual.comments[0].replies[0].date).toEqual('2021-08-08T07:22:33.555Z');
    expect(actual.comments[0].replies[0].username).toEqual('johndoe');

    expect(actual.comments[0].replies[1].id).toEqual('reply-234');
    expect(actual.comments[0].replies[1].content).toEqual('**balasan telah dihapus**');
    expect(actual.comments[0].replies[1].date).toEqual('2021-08-08T07:22:33.555Z');
    expect(actual.comments[0].replies[1].username).toEqual('johndoe');

    expect(actual.comments[1].id).toEqual('comment-234');
    expect(actual.comments[1].username).toEqual('johndoe');
    expect(actual.comments[1].date).toEqual('2021-08-08T07:22:33.555Z');
    expect(actual.comments[1].content).toEqual('**komentar telah dihapus**');

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith('thread-123');
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-234');
  });
});
