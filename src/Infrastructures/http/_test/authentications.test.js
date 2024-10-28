const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const IAuthenticationTokenManager = require('../../../Applications/security/IAuthenticationTokenManager');

describe('/authentications endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /authentications', () => {
    it('should response 201 and persisted token', async () => {
      // Arrange
      const requestPayload = {
        username: 'albert',
        password: 'secret',
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'albert',
          password: 'secret',
          fullname: 'Albertus Khrisna',
        },
      });

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
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
      const requestPayload = {
        username: 'albert',
      };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan username dan password');
    });

    it('should response 400 when login payload has wrong data type', async () => {
      // Arrange
      const requestPayload = {
        username: 'albert',
        password: 123,
      };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username dan password harus string');
    });

    it('should response 400 when user not found', async () => {
      // Arrange
      const requestPayload = {
        username: 'albertus',
        password: 'secret',
      };
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('user tidak ditemukan');
    });

    it('should response 401 when password is wrong', async () => {
      // Arrange
      const requestPayload = {
        username: 'albert',
        password: 'wrong_password',
      };
      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'albert',
          password: 'secret',
          fullname: 'Albertus Khrisna',
        },
      });

      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
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
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'albert',
          password: 'secret',
          fullname: 'Albertus Khrisna',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'albert',
          password: 'secret',
        },
      });

      const { data: { refreshToken } } = JSON.parse(loginResponse.payload);
      const requestPayload = { refreshToken };

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });

    it('should response 400 when payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {};

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan refresh token');
    });

    it('should response 400 when refresh token has wrong data type', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = { refreshToken: 123 };

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus string');
    });

    it('should response 400 when refresh token invalid', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = { refreshToken: 'invalid_refresh_token' };

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should response 400 when refresh token not found in database', async () => {
      // Arrange
      const server = await createServer(container);
      const refreshToken = await container.getInstance(IAuthenticationTokenManager.name).createRefreshToken({ id: 'user-123', username: 'albert' });
      const requestPayload = { refreshToken };

      // Act
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
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
      const server = await createServer(container);
      const requestPayload = {
        refreshToken: 'refresh_token',
      };
      await AuthenticationsTableTestHelper.addToken(requestPayload.refreshToken);

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 400 when refresh token not found in database', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        refreshToken: 'refresh_token',
      };

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 when payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {};

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan refresh token');
    });

    it('should response 400 when refresh token has wrong data type', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = { refreshToken: 123 };

      // Act
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus string');
    });
  });
});
