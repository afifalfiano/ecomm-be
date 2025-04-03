import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from './guard/local.guard';
import { UsersService } from 'src/features/users/users.service';
import { User } from 'src/features/users/entity/user.entity';
import { JwtAuthGuard } from './guard/jwt.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/features/users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @Request() req: { user: any },
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req: { headers: { authorization?: string } }) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1];
    if (token) {
      this.authService.logout(token);
    }
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: User }) {
    return req.user;
  }

  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto): Promise<any> {
    return await this.userService.register(registerUserDto);
  }
}
