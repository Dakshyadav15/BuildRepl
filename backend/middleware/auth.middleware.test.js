import { jest } from '@jest/globals';
import auth from './auth.js';

describe('auth middleware', () => {
  test('returns 401 when no token provided', () => {
    const req = { header: jest.fn().mockReturnValue(undefined) };
    const res = {
      status: jest.fn(function (code) {
        this.statusCode = code;
        return this;
      }),
      json: jest.fn(function (payload) {
        this.body = payload;
        return this;
      }),
    };
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when token is invalid', () => {
    const req = { header: jest.fn().mockReturnValue('invalid-token') };
    const res = {
      status: jest.fn(function (code) {
        this.statusCode = code;
        return this;
      }),
      json: jest.fn(function (payload) {
        this.body = payload;
        return this;
      }),
    };
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
