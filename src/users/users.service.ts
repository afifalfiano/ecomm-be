import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async register(registerUserDto: User) {
    const { name, email, password: plainPassword } = registerUserDto;
    const exist = await this.usersRepository.findOne({ where: { email } });

    if (exist) {
      throw new ConflictException('User already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const safeUser: Promise<Partial<User>> = this.usersRepository.save(newUser);
    delete (await safeUser).password;
    return safeUser;
  }
}
