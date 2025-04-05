import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseAPI } from 'src/common/responses/response';
import { AuthUserDto } from 'src/core/auth/dto/auth.dto';
import { Orders } from '../orders/entity/orders.entity';
import { Repository } from 'typeorm';
import { MidtransService } from './midtrans/midtrans.service';
import { Payments } from './entity/payments';
import { PaymentsMethod, PaymentsStatus } from './enum/status-payments';
import {
  CreateTransactionMidtrans,
  ItemDetailsMidtrans,
} from './interfaces/midtrans.interface';

interface SnapResponse {
  redirect_url: string;
  [key: string]: any; // Adjust this based on the actual response structure
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Orders) private ordersRepository: Repository<Orders>,
    @InjectRepository(Payments)
    private paymentsRepository: Repository<Payments>,
    private readonly midtransService: MidtransService,
  ) {}
  async createPaymentForOrder(
    orderId: number,
    user: AuthUserDto,
  ): Promise<ResponseAPI<Payments | null>> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'orderItems', 'payments'],
    });
    if (!order) throw new NotFoundException('Order not found');
    const items: ItemDetailsMidtrans[] = order.orderItems.map((item) => {
      return {
        item_id: item.products.id,
        price: item.products.price,
        quantity: item.quantity,
        name: item.products.name,
      };
    });

    const body: CreateTransactionMidtrans = {
      id: order.id,
      total_price: Number(order.total_price),
      email: user.email,
      fullname: user.name,
      item_details: items,
    };

    console.log(body);

    const snapResponse = (await this.midtransService.createTransaction(
      body,
    )) as SnapResponse;


    const payment = this.paymentsRepository.create({
      orders: order,
      payment_method: PaymentsMethod.BANK_TRANSFER,
      status: PaymentsStatus.PENDING,
      url_payment: snapResponse.redirect_url
    });

    const savePayment = await this.paymentsRepository.save(payment);

    return {
      message: 'Generate link payment successfully',
      data: savePayment,
      success: true,
    };
  }

  async list(): Promise<ResponseAPI<any>> {
    try {
      const data = await this.paymentsRepository.find({
        relations: ['orders'],
      });
      return {
        message: 'get list of payment',
        data,
        success: true,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
  }
}
