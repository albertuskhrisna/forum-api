const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const IAuthenticationTokenManager = require('../../../Applications/security/IAuthenticationTokenManager');

describe('/authentications endpoint', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /authentications', () => {
    it('should response 201 and persisted token', async () => {
      // Arrange
      const fakerUserPayload = {
        username: 'albert',
        password: 'secret',
        fullname: 'Albertus Khrisna',
      };

      const fakerLoginPayload = {
        username: 'albert',
        password: 'secret',
      };

      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: fakerUserPayload,
      });

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: fakerLoginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it('should response 400 when login payload not contain needed property', async () => {
      // Arrange
      const fakerLoginPayload = {
        username: 'albert',
      };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: fakerLoginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan username dan password');
    });

    it('should response 400 when login payload has wrong data type', async () => {
      // Arrange
      const fakerLoginPayload = {
        username: 'albert',
        password: 123,
      };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: fakerLoginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username dan password harus string');
    });

    it('should response 400 when user not found', async () => {
      // Arrange
      const fakerLoginPayload = {
        username: 'albertus',
        password: 'secret',
      };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: fakerLoginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('user tidak ditemukan');
    });

    it('should response 401 when password is wrong', async () => {
      // Arrange
      const fakerUserPayload = {
        username: 'albert',
        password: 'secret',
        fullname: 'Albertus Khrisna',
      };

      const fakerLoginPayload = {
        username: 'albert',
        password: 'wrong_password',
      };

      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: fakerUserPayload,
      });

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: fakerLoginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('kredensial yang Anda masukkan salah');
    });
  });

  describe('when PUT /authentications', () => {
    it('should response 200 and return new access token', async () => {
      // Arrange
      const fakerUserPayload = {
        username: 'albert',
        password: 'secret',
        fullname: 'Albertus Khrisna',
      };

      const fakerLoginPayload = {
        username: 'albert',
        password: 'secret',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: fakerUserPayload,
      });

      const fakerLoginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: fakerLoginPayload,
      });

      const { data: { refreshToken } } = JSON.parse(fakerLoginResponse.payload);
      const fakerRefreshTokenPayload = { refreshToken };

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: fakerRefreshTokenPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it('should response 400 when payload not contain refresh token', async () => {
      // Arrange
      const fakerRefreshTokenPayload = {};
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: fakerRefreshTokenPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan refresh token');
    });

    it('should response 400 when refresh token has wrong data type', async () => {
      // Arrange
      const fakerRefreshToken = { refreshToken: 123 };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: fakerRefreshToken,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus string');
    });

    it('should response 400 when refresh token invalid', async () => {
      // Arrange
      const fakerRefreshToken = { refreshToken: 'invalid_refresh_token' };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: fakerRefreshToken,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should response 400 when refresh token not found in database', async () => {
      // Arrange
      const refreshToken = await container.getInstance(IAuthenticationTokenManager.name).createRefreshToken({ id: 'user-123', username: 'albert' });
      const fakerRefreshToken = { refreshToken };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: fakerRefreshToken,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 when refresh token is valid', async () => {
      // Arrange
      await AuthenticationsTableTestHelper.addToken('refresh_token');
      const fakerLogoutPayload = {
        refreshToken: 'refresh_token',
      };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: fakerLogoutPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 when refresh token not found in database', async () => {
      // Arrange
      const fakerLogoutPayload = {
        refreshToken: 'refresh_token',
      };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: fakerLogoutPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 when payload not contain refresh token', async () => {
      // Arrange
      const fakerLogoutPayload = {};
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: fakerLogoutPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan refresh token');
    });

    it('should response 400 when refresh token has wrong data type', async () => {
      // Arrange
      const fakerLogoutPayload = { refreshToken: 123 };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: fakerLogoutPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus string');
    });
  });
});
