const ForbiddenError = require('../ForbiddenError');

describe('An ForbiddenError', () => {
  it('should create an error correctly', () => {
    const forbiddenError = new ForbiddenError('forbidden error!');

    expect(forbiddenError.name).toEqual('ForbiddenError');
    expect(forbiddenError.statusCode).toEqual(403);
    expect(forbiddenError.message).toEqual('forbidden error!');
  });
});
