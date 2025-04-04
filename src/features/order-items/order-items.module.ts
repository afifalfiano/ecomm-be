import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItems } from './entity/order-items.entity';

@Module({
  providers: [OrderItemsService],
  controllers: [OrderItemsController],
  exports: [OrderItemsService],
  imports: [TypeOrmModule.forFeature([OrderItems])],
})
export class OrderItemsModule {}
