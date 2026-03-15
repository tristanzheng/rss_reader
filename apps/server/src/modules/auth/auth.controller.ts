import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from '../../common/auth/public.decorator';
import { TokenService } from '../../common/auth/token.service';

interface DevTokenBody {
  userId: string;
  roles?: string[];
}

@Controller('auth')
export class AuthController {
  constructor(private readonly tokenService: TokenService) {}

  @Public()
  @Post('dev-token')
  devToken(@Body() body: DevTokenBody) {
    const enabled = process.env.ENABLE_DEV_AUTH_ENDPOINT === '1';
    if (!enabled) {
      throw new UnauthorizedException('Dev auth endpoint is disabled');
    }

    const userId = body.userId?.trim();
    if (!userId) {
      throw new UnauthorizedException('userId is required');
    }

    return {
      token: this.tokenService.signForUser(userId, body.roles ?? []),
    };
  }
}
