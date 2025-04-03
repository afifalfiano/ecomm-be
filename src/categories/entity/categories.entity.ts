import {
  Column,
  CreateDateColumn,
  Entity,
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
}
