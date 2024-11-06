const Authentication = require('../Authentication');

describe('Authentication entity', () => {
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

  it('should construct Authentication object correctly when payload is valid', () => {
    const payload = {
      accessToken: 'A',
      refreshToken: 'B',
    };

    const actual = new Authentication(payload);

    expect(actual).toBeInstanceOf(Authentication);
    expect(actual.accessToken).toEqual(payload.accessToken);
    expect(actual.refreshToken).toEqual(payload.refreshToken);
  });
});
