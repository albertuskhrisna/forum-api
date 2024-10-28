const NotFoundError = require('../NotFoundError');

describe('A NotFoundError', () => {
  it('should create an error correctly', () => {
    const notFoundError = new NotFoundError('not found!');

    expect(notFoundError.name).toEqual('NotFoundError');
    expect(notFoundError.statusCode).toEqual(404);
    expect(notFoundError.message).toEqual('not found!');
  });
});
