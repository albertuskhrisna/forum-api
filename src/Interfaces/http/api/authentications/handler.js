const LoginUserUseCase = require('../../../../Applications/useCases/LoginUserUseCase');
const RefreshTokenUseCase = require('../../../../Applications/useCases/RefreshTokenUseCase');
const LogoutUserUseCase = require('../../../../Applications/useCases/LogoutUserUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
  }

  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    const refreshAuthenticationUseCase = this._container.getInstance(RefreshTokenUseCase.name);
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAuthenticationHandler(request) {
    const logoutUserUseCase = this._container.getInstance(LogoutUserUseCase.name);
    await logoutUserUseCase.execute(request.payload);
    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
