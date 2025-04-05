import { Injectable, LoggerService, NotFoundException } from '@nestjs/common';
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
  MidtransSignatureBody,
} from './interfaces/midtrans.interface';
import { createHash } from 'crypto';
import { PinoLogger } from 'nestjs-pino';
import { OrderStatus } from 'src/common/enum/status-order';

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
    private readonly logger: PinoLogger,
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

    const snapResponse = (await this.midtransService.createTransaction(
      body,
    )) as SnapResponse;

    const payment = this.paymentsRepository.create({
      orders: order,
      payment_method: PaymentsMethod.BANK_TRANSFER,
      status: PaymentsStatus.PENDING,
      url_payment: snapResponse.redirect_url,
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

  verifyMidtransSignature(body: MidtransSignatureBody): boolean {
    const { order_id, status_code, gross_amount, signature_key } = body;

    const serverKey = process.env.MIDTRANS_SERVER;
    const rawSignature = order_id + status_code + gross_amount + serverKey;
    const expectedSignature = createHash('sha512')
      .update(rawSignature)
      .digest('hex');

    return signature_key === expectedSignature;
  }

  async updatePaymentStatusFromMidtrans(payload: {
    order_id: string;
    transaction_status: string;
  }): Promise<ResponseAPI<any>> {
    const { order_id, transaction_status } = payload;

    let paymentStatus: PaymentsStatus;
    let orderStatus: OrderStatus;

    switch (transaction_status) {
      case 'settlement':
      case 'capture':
        paymentStatus = PaymentsStatus.COMPLETED;
        orderStatus = OrderStatus.PAID;
        break;
      case 'pending':
        paymentStatus = PaymentsStatus.PENDING;
        orderStatus = OrderStatus.PENDING;
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
        paymentStatus = PaymentsStatus.FAILED;
        orderStatus = OrderStatus.CANCELED;
        break;
      default:
        paymentStatus = PaymentsStatus.PENDING;
        orderStatus = OrderStatus.PENDING;
    }

    const id = order_id.split('-')[2];
    const order = await this.ordersRepository.findOneBy({
      id: parseInt(id, 10),
    });
    if (!order) throw new Error('Order not found');

    const payment = await this.paymentsRepository.findOneBy({
      orders: { id: order?.id },
    });
    if (!payment) throw new Error('Payment record not found');

    payment.status = paymentStatus;
    const updateData = await this.paymentsRepository.update(
      payment.id,
      payment,
    );
    this.logger.info('✅ Payment status updated for order:', order_id);

    order.status = orderStatus;
    await this.ordersRepository.update(order.id, order);
    this.logger.info('✅ Order status updated for order:', order_id);

    return {
      message: 'Success Update Status Payment & Status Order',
      success: true,
      data: updateData,
    };
  }
}
