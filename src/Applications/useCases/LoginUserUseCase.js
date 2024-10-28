const Authentication = require('../../Domains/authentication/entities/Authentication');
const LoginUser = require('../../Domains/users/entities/LoginUser');

class LoginUserUseCase {
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(payload) {
    const { username, password } = new LoginUser(payload);
    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);
    await this._passwordHash.comparePassword(password, encryptedPassword);
    const id = await this._userRepository.getUserIdByUsername(username);

    const accessToken = await this._authenticationTokenManager
      .createAccessToken({ username, id });

    const refreshToken = await this._authenticationTokenManager
      .createRefreshToken({ username, id });

    const newAuthentication = new Authentication({
      accessToken,
      refreshToken,
    });

    await this._authenticationRepository.addToken(newAuthentication.refreshToken);
    return newAuthentication;
  }
}

module.exports = LoginUserUseCase;
