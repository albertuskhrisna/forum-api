const IThreadRepository = require('../../../Domains/threads/IThreadRepository');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('Add Thread use case', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const payload = {
      title: 'A',
      body: 'B',
    };

    const createThread = new CreateThread({
      title: payload.title,
      body: payload.body,
      owner: 'user-123',
    });

    const expected = new CreatedThread({
      id: 'thread-123',
      title: payload.title,
      owner: 'user-123',
    });

    const mockThreadRepository = new IThreadRepository();
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(expected));

    const sut = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    // Act
    const actual = await sut.execute('user-123', payload);

    // Assert
    expect(actual).toStrictEqual(new CreatedThread({
      id: expected.id,
      title: expected.title,
      owner: expected.owner,
    }));

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(createThread);
  });
});
