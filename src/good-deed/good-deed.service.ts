import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoodDeed } from './good-deed.entity';
import { CreateGoodDeedDto } from './dto/create-good-deed.dto';
import { UpdateGoodDeedDto } from './dto/update-good-deed.dto';
import { User } from '../user/user.entity';

@Injectable()
export class GoodDeedService {
  constructor(
    @InjectRepository(GoodDeed)
    private readonly goodDeedRepository: Repository<GoodDeed>,
  ) {}

  async findAllByUser(user: User): Promise<GoodDeed[]> {
    return this.goodDeedRepository.find({ where: { user } });
  }

  async create(
    createGoodDeedDto: CreateGoodDeedDto,
    user: User,
  ): Promise<GoodDeed> {
    const goodDeed = this.goodDeedRepository.create({
      ...createGoodDeedDto,
      completed: false,
      user,
    });
    const result = await this.goodDeedRepository.save(goodDeed);
    delete result.user;

    return result;
  }

  async update(
    id: number,
    updateGoodDeedDto: UpdateGoodDeedDto,
    user: User,
  ): Promise<GoodDeed> {
    const goodDeed = await this.goodDeedRepository.findOne({
      where: { id, user },
    });

    if (!goodDeed) {
      throw new NotFoundException('Good deed not found');
    }

    Object.assign(goodDeed, updateGoodDeedDto);
    return this.goodDeedRepository.save(goodDeed);
  }

  async remove(id: number, user: User): Promise<void> {
    const result = await this.goodDeedRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException('Good deed not found');
    }
  }
}
