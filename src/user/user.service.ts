import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
      delete user.password;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;

    return updatedUser;
  }

  async remove(id: number) {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException('Good deed not found');
    }
  }
}
