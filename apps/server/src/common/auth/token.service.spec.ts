import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

describe('TokenService', () => {
  it('signs token with user sub', () => {
    const jwt = {
      sign: jest.fn().mockReturnValue('token-1'),
    } as unknown as JwtService;

    const service = new TokenService(jwt);
    const token = service.signForUser('u1');

    expect(token).toBe('token-1');
    expect((jwt.sign as jest.Mock).mock.calls[0][0]).toEqual({
      sub: 'u1',
      roles: [],
    });
  });

  it('signs token with user sub and roles', () => {
    const jwt = {
      sign: jest.fn().mockReturnValue('token-2'),
    } as unknown as JwtService;

    const service = new TokenService(jwt);
    const token = service.signForUser('u2', ['worker']);

    expect(token).toBe('token-2');
    expect((jwt.sign as jest.Mock).mock.calls[0][0]).toEqual({
      sub: 'u2',
      roles: ['worker'],
    });
  });
});
