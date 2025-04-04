import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseAPI } from 'src/common/responses/response';
import { AuthUserDto } from 'src/core/auth/dto/auth.dto';
import { Orders } from '../orders/entity/orders.entity';
import { Repository } from 'typeorm';
import { MidtransService } from './midtrans/midtrans.service';

interface SnapResponse {
  redirect_url: string;
  [key: string]: any; // Adjust this based on the actual response structure
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Orders) private ordersRepository: Repository<Orders>,
    private readonly midtransService: MidtransService,
  ) {}
  async createPaymentForOrder(
    orderId: number,
    user: AuthUserDto,
  ): Promise<ResponseAPI<string>> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const snapResponse = (await this.midtransService.createTransaction({
      id: order.id,
      total_price: Number(order.total_price),
      email: user.email,
      fullname: user.name,
    })) as SnapResponse;

    // const payment = this.paymentsRepository.create({
    //   order_id: n,
    //   payment_method: 'bank_transfer',
    //   status: 'pending',
    // });
    // const savePayment = await this.paymentsRepository.save(payment);
    // console.log(savePayment);
    return {
      message: 'Generate link payment successfully',
      data: snapResponse.redirect_url,
      success: true,
    };
  }
}
