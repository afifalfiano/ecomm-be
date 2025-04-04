import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entity/orders.entity';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
  imports: [TypeOrmModule.forFeature([Orders])],
})
export class OrdersModule {}
