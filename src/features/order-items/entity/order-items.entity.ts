import { Orders } from 'src/features/orders/entity/orders.entity';
import { Products } from 'src/features/products/entity/products.entity';
import { User } from 'src/features/users/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Products, (products) => products.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  products: Products;

  @ManyToOne(() => Orders, (orders) => orders.id, {
    onDelete: 'SET NULL',
    eager: true,
  })
  orders: Orders;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;
}
