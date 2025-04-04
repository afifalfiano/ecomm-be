import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payments } from './entity/payments';
import { MidtransService } from './midtrans/midtrans.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  providers: [PaymentsService, MidtransService, OrdersService],
  controllers: [PaymentsController],
  exports: [PaymentsService, MidtransService],
  imports: [TypeOrmModule.forFeature([Payments]), OrdersModule],
})
export class PaymentsModule {}
