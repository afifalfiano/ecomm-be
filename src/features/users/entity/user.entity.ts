import { Exclude } from 'class-transformer';
import { OrderItems } from 'src/features/order-items/entity/order-items.entity';
import { Orders } from 'src/features/orders/entity/orders.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @OneToMany(() => Orders, (orders) => orders.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  orders: Orders;

  @OneToMany(() => OrderItems, (orderItems) => orderItems.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  orderItems: OrderItems;
}
