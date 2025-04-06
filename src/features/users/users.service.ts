import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { ResponseAPI } from 'src/common/responses/response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async register(registerUserDto: CreateUserDto): Promise<ResponseAPI<any>> {
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

    const user = await this.usersRepository.save(newUser);

    return {
      message: 'Success registry a new user',
      success: true,
      data: user,
    };
  }
}
