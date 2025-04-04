import { Injectable } from '@nestjs/common';
import * as midtransClient from 'midtrans-client';

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

  async createTransaction(order: { id: number; total_price: number; fullname: string, email: string }) {
    return await this.snap.createTransaction({
      transaction_details: {
        order_id: `ORDER-${order.id}`,
        gross_amount: order.total_price,
      },
      customer_details: {
        first_name: order.fullname,
        email: order.email,
      },
    });
  }
}
