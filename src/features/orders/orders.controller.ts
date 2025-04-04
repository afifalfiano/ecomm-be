import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order';
import { Orders } from './entity/orders.entity';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt.guard';
import { ResponseAPI } from 'src/common/responses/response';
import { CurrentUser } from 'src/core/auth/decorator/user.decorator';
import { AuthUserDto } from 'src/core/auth/dto/auth.dto';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new order with items' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(@CurrentUser() user: AuthUserDto): Promise<ResponseAPI<Orders>> {
    return this.orderService.createOrder(user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of orders',
    type: ResponseAPI<Orders>,
  })
  async list() {
    return this.orderService.list();
  }
}
