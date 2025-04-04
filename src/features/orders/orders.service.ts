import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order';
import { ResponseAPI } from 'src/common/responses/response';
import { Orders } from './entity/orders.entity';
import { Products } from '../products/entity/products.entity';
import { OrderItems } from '../order-items/entity/order-items.entity';
import { OrderStatus } from 'src/common/enum/status-order';
import { AuthUserDto } from 'src/core/auth/dto/auth.dto';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class OrdersService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly logger: PinoLogger,
    @InjectRepository(Orders) private ordersRepository: Repository<Orders>,
  ) {}

  async createOrder(user: AuthUserDto): Promise<ResponseAPI<Orders>> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Get All Order Items that don't have order_id
      const orderItems = await manager.find(OrderItems, {
        where: { order_id: IsNull() },
      });

      const totalPrice = orderItems.reduce((sum, item) => {
        return sum + Number(item.subtotal);
      }, 0);

      if (orderItems.length === 0) {
        this.logger.warn('No order items found for user');
        throw new Error('No items to order');
      }

      // 2. Create order
      const order = manager.create(Orders, {
        user_id: user.sub,
        total_price: totalPrice,
        status: OrderStatus.PENDING,
      });

      const savedOrder = await manager.save(order);
      this.logger.info({ orderId: savedOrder.id }, 'Order created');

      // 3. Update order_id on order items
      for (const item of orderItems) {
        item.order_id = savedOrder.id;
        await manager.save(OrderItems, item);
      }

      return {
        message: 'Order created successfully',
        data: order,
        success: true,
      };
    });
  }

  async list() {
    try {
      const data = await this.ordersRepository.find({
        relations: ['orderItems', 'orderItems.product_id'],
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
