/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ResponseAPI } from 'src/common/responses/response';
import { CurrentUser } from 'src/core/auth/decorator/user.decorator';
import { AuthUserDto } from 'src/core/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt.guard';
import { PaymentsService } from './payments.service';
import { PinoLogger } from 'nestjs-pino';
import { V1Controller } from 'src/core/auth/decorator/v1-controller.decorator';

@V1Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly logger: PinoLogger,
  ) {}

  @Post('webhook/midtrans')
  async handleMidtransWebhook(@Request() request: { body: any }) {
    const body: any = request.body;
    this.logger.info('📩 Webhook received:', request);

    const isValid = this.paymentsService.verifyMidtransSignature(body);
    if (!isValid) {
      this.logger.warn('❌ Invalid signature');
      return;
    }

    return this.paymentsService.updatePaymentStatusFromMidtrans(body);
  }

  @Post('create/:id')
  @UseGuards(JwtAuthGuard)
  async pay(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUserDto,
  ): Promise<ResponseAPI<any>> {
    return this.paymentsService.createPaymentForOrder(id, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(): Promise<ResponseAPI<any>> {
    return this.paymentsService.list();
  }
}
