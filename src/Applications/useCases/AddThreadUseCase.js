const CreateThread = require('../../Domains/threads/entities/CreateThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, payload) {
    const createThread = new CreateThread({ ...payload, owner: userId });
    return this._threadRepository.addThread(createThread);
  }
}

module.exports = AddThreadUseCase;
