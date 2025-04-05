import { OrderStatus } from 'src/common/enum/status-order';
import { OrderItems } from 'src/features/order-items/entity/order-items.entity';
import { Payments } from 'src/features/payments/entity/payments';
import { User } from 'src/features/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => OrderItems, (orderItems) => orderItems.orders, {
    onDelete: 'CASCADE',
  })
  orderItems: OrderItems[];

  @OneToOne(() => Payments, (payment) => payment.orders, {
    cascade: true,
  })
  payments: Payments;
}
