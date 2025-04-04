import { Orders } from 'src/features/orders/entity/orders.entity';
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
import { PaymentsMethod, PaymentsStatus } from '../enum/status-payments';
import { Optional } from '@nestjs/common';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

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

  @OneToOne(() => Orders, (order) => order.payments_id)
  order_id: number;
}
