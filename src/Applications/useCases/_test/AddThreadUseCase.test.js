const IThreadRepository = require('../../../Domains/threads/IThreadRepository');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('Add Thread use case', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'a thread title',
      body: 'a thread body',
    };

    const fakerCreateThread = new CreateThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'user-123',
    });

    const fakerCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    const expectedReturn = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    const mockThreadRepository = new IThreadRepository();
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(fakerCreatedThread));
    const sut = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    // Act
    const actual = await sut.execute('user-123', useCasePayload);

    // Assert
    expect(actual).toStrictEqual(expectedReturn);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(fakerCreateThread);
  });
});
