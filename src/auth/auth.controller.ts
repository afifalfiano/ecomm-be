import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { LocalGuard } from './guard/local.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { JwtAuthGuard } from './guard/jwt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Request() req: any): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    console.log(req)
    const token = req.headers.authorization?.split(' ')[1]; // Extract JWT from Bearer token
    if (token) {
      this.authService.logout(token);
    }
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  async register(@Body() registerUserDto: User): Promise<any> {
    return await this.userService.register(registerUserDto);
  }
}
