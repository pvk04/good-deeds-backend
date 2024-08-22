import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from './friendship.entity';
import { User } from '../user/user.entity';
import { AddFriendDto } from './dto/add-friend.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    private readonly userService: UserService,
  ) {}

  async addFriend(addFriendDto: AddFriendDto, user: User): Promise<Friendship> {
    const friend = await this.userService.findOneByUsername(
      addFriendDto.username,
    );

    if (!friend) {
      throw new NotFoundException('User not found');
    }

    const existingFriendship = await this.friendshipRepository.findOne({
      where: { user, friend },
    });

    if (existingFriendship) {
      throw new ConflictException('You are already friends with this user');
    }

    const friendship = this.friendshipRepository.create({ user, friend });
    return this.friendshipRepository.save(friendship);
  }

  async getFriends(user: User): Promise<User[]> {
    const friendships = await this.friendshipRepository.find({
      where: { user },
      relations: ['friend'],
    });
    return friendships.map((f) => f.friend);
  }

  async findFriendByUsername(username: string, user: User): Promise<User> {
    const friend = await this.userService.findOneByUsername(username);

    if (!friend) {
      throw new NotFoundException('User not found');
    }

    const friendship = await this.friendshipRepository.findOne({
      where: { user, friend },
    });

    if (!friendship) {
      throw new NotFoundException('You are not friends with this user');
    }

    return friend;
  }
}
