const ClientError = require('../ClientError');

describe('A ClientError', () => {
  it('should throw error when directly used', () => {
    expect(() => new ClientError('')).toThrow(Error('cannot instantiate an abstract class'));
  });
});
