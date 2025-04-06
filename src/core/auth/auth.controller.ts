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
import { ResponseAPI } from 'src/common/responses/response';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthPayloadDto, AuthUserDto } from './dto/auth.dto';
import { V1Controller } from './decorator/v1-controller.decorator';

@V1Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login app' })
  @ApiBody({
    examples: {
      default: {
        summary: 'Example login payload',
        value: {
          email: 'afif@yopmail.com',
          password: '123345',
        },
      },
    },
    type: AuthPayloadDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    content: {
      'application/json': {
        example: {
          message: 'Login successful',
          success: true,
          data: {
            access_token: 'your.jwt.token.here',
          },
        },
      },
    },
  })
  @UseGuards(LocalGuard)
  login(
    @Request() req: Request & { user: User },
  ): ResponseAPI<{ access_token: string } | null> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout app' })
  @ApiResponse({
    status: 201,
    description: 'Logout successfully',
    content: {
      'application/json': {
        example: {
          message: 'Logout successfully',
          success: true,
          data: {},
        },
      },
    },
  })
  @Post('logout')
  logout(@Request() req: Request & { headers: { authorization?: string } }) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1];
    if (token) {
      const logOut = this.authService.logout(token);
      return {
        data: logOut,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get info token user' })
  @ApiResponse({
    status: 201,
    description: 'Get info token successfully',
    type: AuthUserDto,
    content: {
      'application/json': {
        example: {
          sub: 1,
          email: 'afif@yopmail.com',
          name: 'Afif Alfiano',
          iat: new Date().getTime(),
          exp: new Date().getTime(),
        },
      },
    },
  })
  @Get('info')
  getProfile(@Request() req: { user: AuthUserDto }): ResponseAPI<AuthUserDto> {
    return {
      success: true,
      message: 'Get token info successfully',
      data: {
        ...req.user,
      },
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'register a new user' })
  @ApiResponse({
    status: 201,
    description: 'Register successfully',
    content: {
      'application/json': {
        example: {
          sub: 1,
          email: 'afif@yopmail.com',
          name: 'Afif Alfiano',
          iat: 'user',
          exp: '2024-04-06T12:00:00Z',
        },
      },
    },
  })
  async register(
    @Body() registerUserDto: CreateUserDto,
  ): Promise<ResponseAPI<any>> {
    return this.userService.register(registerUserDto);
  }
}
