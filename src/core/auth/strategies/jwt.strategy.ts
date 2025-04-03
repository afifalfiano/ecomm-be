import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'abc123',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload): Promise<any> {
    const authHeader = req?.headers?.authorization; // Ensure `req` exists
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1]; // Extract token

    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    if (this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return payload;
  }
}
