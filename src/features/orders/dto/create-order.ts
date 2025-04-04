import { CreateOrderItemDto } from 'src/features/order-items/dto/create-order-item';

export class CreateOrderDto {
  user_id: number;
  items: CreateOrderItemDto[];
}
