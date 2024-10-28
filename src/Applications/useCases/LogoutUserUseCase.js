class LogoutUserUseCase {
  constructor({ authenticationRepository }) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { refreshToken } = payload;

    await this._authenticationRepository.checkTokenAvailability(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  _verifyPayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('LOGOUT_USER_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('LOGOUT_USER_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LogoutUserUseCase;
