import { IsString, Length, Matches } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
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
  @IsString()
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
