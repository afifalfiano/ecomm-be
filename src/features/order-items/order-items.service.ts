import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { OrderItems } from './entity/order-items.entity';
import { DataSource, Repository } from 'typeorm';
import { Products } from '../products/entity/products.entity';
import { ResponseAPI } from 'src/common/responses/response';
import { AuthUserDto } from 'src/core/auth/dto/auth.dto';
import { User } from '../users/entity/user.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(OrderItems)
    private orderItemsRepository: Repository<OrderItems>,
  ) {}

  async add(
    addOrderItems: CreateOrderItemDto,
    userAuth: AuthUserDto,
  ): Promise<ResponseAPI<OrderItems>> {
    const { product_id, quantity } = addOrderItems;
    return await this.dataSource.transaction(async (manager) => {
      const products = await manager.findOne(Products, {
        where: { id: product_id.toString() },
      });

      const user = await manager.findOne(User, {
        where: { id: userAuth.sub },
      });

      if (!products) {
        throw new Error(`Product ID ${product_id} not found`);
      }

      const subtotal = Number(products.price) * quantity;
      if (!user) {
        throw new Error(`User ID ${userAuth.sub} not found`);
      }

      const orderItem = manager.create(OrderItems, {
        user: user,
        products: products,
        subtotal,
        quantity,
      });

      const saveOrderItem = await manager.save(OrderItems, orderItem);

      return {
        message: 'Order item added successfully',
        data: saveOrderItem,
        success: true,
      };
    });
  }

  async list() {
    try {
      const data = await this.orderItemsRepository.find();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
