import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderItemsService } from './order-items.service';
import { ResponseAPI } from 'src/common/responses/response';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt.guard';
import { Orders } from '../orders/entity/orders.entity';
import { CreateOrderItemDto } from './dto/create-order-item';
import { OrderItems } from './entity/order-items.entity';
import { CurrentUser } from 'src/core/auth/decorator/user.decorator';
import { AuthUserDto } from 'src/core/auth/dto/auth.dto';

@Controller('order-items')
@ApiTags('Order Items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a order items' })
  @ApiResponse({ status: 201, description: 'Order Item added' })
  async create(
    @Body() addOrderItems: CreateOrderItemDto,
    @CurrentUser() user: AuthUserDto,
  ): Promise<ResponseAPI<OrderItems>> {
    return this.orderItemsService.add(addOrderItems, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of orders',
    type: ResponseAPI<Orders>,
  })
  async list() {
    return this.orderItemsService.list();
  }
}
