import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/features/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private blacklistedTokens = new Set<string>();
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: AuthPayloadDto): Promise<any> {
    const user = await this.userService.findByEmail(email);
    const compareBcrypt = user && (await bcrypt.compare(password, user.password))
    if (compareBcrypt) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(user: any) {
    const payload = { name: user.name, email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  logout(token: string) {
    this.blacklistedTokens.add(token); // Add token to blacklist
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
