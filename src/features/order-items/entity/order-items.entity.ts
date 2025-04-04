import { Optional } from '@nestjs/common';
import { Orders } from 'src/features/orders/entity/orders.entity';
import { Products } from 'src/features/products/entity/products.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Products, (product) => product.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  product_id: number;

  @ManyToOne(() => Orders, (order) => order.id, {
    onDelete: 'CASCADE',
  })
  @Optional()
  order_id?: number;
}
