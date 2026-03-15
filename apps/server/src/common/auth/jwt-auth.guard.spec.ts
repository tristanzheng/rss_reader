import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('allows request when marked public', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(true),
    } as unknown as Reflector;
    const jwtService = {
      verify: jest.fn(),
    } as unknown as JwtService;

    const guard = new JwtAuthGuard(reflector, jwtService);
    const request: { headers: Record<string, string>; user?: { id: string } } = {
      headers: {},
    };
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows request with valid bearer token', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;
    const jwtService = {
      verify: jest.fn().mockReturnValue({ sub: 'u1' }),
    } as unknown as JwtService;

    const guard = new JwtAuthGuard(reflector, jwtService);
    const request: { headers: Record<string, string>; user?: { id: string } } = {
      headers: { authorization: 'Bearer valid-token' },
    };
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;

    expect(guard.canActivate(context)).toBe(true);
    expect(request.user?.id).toBe('u1');
  });

  it('throws when bearer token is missing', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;
    const jwtService = {
      verify: jest.fn(),
    } as unknown as JwtService;

    const guard = new JwtAuthGuard(reflector, jwtService);
    const request = { headers: {} };
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('throws when token is invalid', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;
    const jwtService = {
      verify: jest.fn().mockImplementation(() => {
        throw new Error('bad token');
      }),
    } as unknown as JwtService;

    const guard = new JwtAuthGuard(reflector, jwtService);
    const request = { headers: { authorization: 'Bearer bad-token' } };
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('throws when token has no sub', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;
    const jwtService = {
      verify: jest.fn().mockReturnValue({}),
    } as unknown as JwtService;

    const guard = new JwtAuthGuard(reflector, jwtService);
    const request = { headers: { authorization: 'Bearer no-sub-token' } };
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('allows request when route roles are satisfied', () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(['worker']),
    } as unknown as Reflector;
    const jwtService = {
      verify: jest.fn().mockReturnValue({ sub: 'u1', roles: ['worker'] }),
    } as unknown as JwtService;

    const guard = new JwtAuthGuard(reflector, jwtService);
    const request: { headers: Record<string, string>; user?: { id: string } } = {
      headers: { authorization: 'Bearer valid-token' },
    };
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('throws when route roles are not satisfied', () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(['admin']),
    } as unknown as Reflector;
    const jwtService = {
      verify: jest.fn().mockReturnValue({ sub: 'u1', roles: ['user'] }),
    } as unknown as JwtService;

    const guard = new JwtAuthGuard(reflector, jwtService);
    const request = { headers: { authorization: 'Bearer valid-token' } };
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
