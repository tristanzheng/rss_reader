import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  it('returns dev token when enabled', () => {
    const tokenService = {
      signForUser: jest.fn().mockReturnValue('token-1'),
    };

    const controller = new AuthController(tokenService as never);
    const oldValue = process.env.ENABLE_DEV_AUTH_ENDPOINT;
    process.env.ENABLE_DEV_AUTH_ENDPOINT = '1';

    const result = controller.devToken({ userId: 'u1' });
    expect(result).toEqual({ token: 'token-1' });
    expect(tokenService.signForUser).toHaveBeenCalledWith('u1', []);

    process.env.ENABLE_DEV_AUTH_ENDPOINT = oldValue;
  });

  it('passes roles when provided', () => {
    const tokenService = {
      signForUser: jest.fn().mockReturnValue('token-2'),
    };

    const controller = new AuthController(tokenService as never);
    const oldValue = process.env.ENABLE_DEV_AUTH_ENDPOINT;
    process.env.ENABLE_DEV_AUTH_ENDPOINT = '1';

    const result = controller.devToken({ userId: 'u1', roles: ['worker'] });
    expect(result).toEqual({ token: 'token-2' });
    expect(tokenService.signForUser).toHaveBeenCalledWith('u1', ['worker']);

    process.env.ENABLE_DEV_AUTH_ENDPOINT = oldValue;
  });

  it('throws when dev endpoint disabled', () => {
    const tokenService = {
      signForUser: jest.fn(),
    };

    const controller = new AuthController(tokenService as never);
    const oldValue = process.env.ENABLE_DEV_AUTH_ENDPOINT;
    process.env.ENABLE_DEV_AUTH_ENDPOINT = '0';

    expect(() => controller.devToken({ userId: 'u1' })).toThrow(
      UnauthorizedException,
    );

    process.env.ENABLE_DEV_AUTH_ENDPOINT = oldValue;
  });

  it('throws when userId is empty', () => {
    const tokenService = {
      signForUser: jest.fn(),
    };

    const controller = new AuthController(tokenService as never);
    const oldValue = process.env.ENABLE_DEV_AUTH_ENDPOINT;
    process.env.ENABLE_DEV_AUTH_ENDPOINT = '1';

    expect(() => controller.devToken({ userId: '   ' })).toThrow(
      UnauthorizedException,
    );

    process.env.ENABLE_DEV_AUTH_ENDPOINT = oldValue;
  });
});
