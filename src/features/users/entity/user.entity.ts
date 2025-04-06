import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @ApiProperty()
  @Exclude()
  @OneToMany(() => Orders, (orders) => orders.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  orders: Orders;

  @ApiProperty()
  @Exclude()
  @OneToMany(() => OrderItems, (orderItems) => orderItems.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  orderItems: OrderItems;
}
