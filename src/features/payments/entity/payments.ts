import { Orders } from 'src/features/orders/entity/orders.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentsMethod, PaymentsStatus } from '../enum/status-payments';
import { Exclude } from 'class-transformer';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @Column({ type: 'text' })
  url_payment?: string;

  @Column({
    type: 'enum',
    enum: PaymentsStatus,
    default: PaymentsStatus.PENDING,
  })
  status: PaymentsStatus;

  @Column({
    type: 'enum',
    enum: PaymentsMethod,
    default: PaymentsMethod.BANK_TRANSFER,
  })
  payment_method: PaymentsMethod;

  @OneToOne(() => Orders, (order) => order.payments, { eager: true })
  @JoinColumn()
  orders: Orders;
}
