const Authentication = require('../Authentication');

describe('Authentication entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      accessToken: 'A',
    };

    expect(() => new Authentication(payload)).toThrow(Error('AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      accessToken: 'A',
      refreshToken: 123,
    };

    expect(() => new Authentication(payload)).toThrow(Error('AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION'));
  });

  it('should create Authentication object correctly', () => {
    const payload = {
      accessToken: 'A',
      refreshToken: 'B',
    };

    const authentication = new Authentication(payload);

    expect(authentication).toBeInstanceOf(Authentication);
    expect(authentication.accessToken).toEqual(payload.accessToken);
    expect(authentication.refreshToken).toEqual(payload.refreshToken);
  });
});
