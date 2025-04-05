/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import * as midtransClient from 'midtrans-client';
import { CreateTransactionMidtrans, ItemDetailsMidtrans } from '../interfaces/midtrans.interface';

@Injectable()
export class MidtransService {
  private snap: midtransClient.Snap;
  constructor() {
    this.snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER || '',
      clientKey: process.env.MIDTRANS_CLIENT || '',
    });
  }

  async createTransaction(order: CreateTransactionMidtrans) {
    const { id, total_price, fullname, email, item_details } = order;
    return await this.snap.createTransaction({
      transaction_details: {
        order_id: `${process.env.ORDER_IDENTITY}${id}`,
        gross_amount: total_price,
        currency: 'IDR',
      },
      usage_limit: 1,
      expiry: {
        unit: 'days',
        duration: 1,
        lifetime: false,
      },
      customer_details: {
        first_name: fullname,
        email: email,
      },
      item_details: item_details,
    });
  }
}
