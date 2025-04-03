import { Products } from 'src/features/products/entity/products.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
}
