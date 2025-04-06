import { Get } from '@nestjs/common';
import { AppService } from './app.service';
import { V1Controller } from './core/auth/decorator/v1-controller.decorator';

@V1Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
