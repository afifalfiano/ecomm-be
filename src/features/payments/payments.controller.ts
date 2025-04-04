import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ResponseAPI } from 'src/common/responses/response';
import { CurrentUser } from 'src/core/auth/decorator/user.decorator';
import { AuthUserDto } from 'src/core/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt.guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create/:id')
  @UseGuards(JwtAuthGuard)
  async pay(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUserDto,
  ): Promise<ResponseAPI<any>> {
    return this.paymentsService.createPaymentForOrder(id, user);
  }
}
