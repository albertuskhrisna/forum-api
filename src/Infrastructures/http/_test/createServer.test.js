const createServer = require('../createServer');

describe('A HTTP Server', () => {
  describe('when GET /', () => {
    it('should return 200 and API description', async () => {
      // Arrange
      const server = await createServer({});

      // Act
      const response = await server.inject({
        method: 'GET',
        url: '/',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.value).toEqual('Forum API V2 developed by Albertus Khrisna');
    });
  });

  it('should response 404 when request unregistered route', async () => {
    const server = await createServer({});

    const response = await server.inject({
      method: 'GET',
      url: '/users',
    });

    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const fakerUserPayload = {
      username: 'albert',
      password: 'secret',
      fullname: 'Albertus Khrisna',
    };
    const server = await createServer({});

    // Act
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: fakerUserPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });
});
