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
import { GoodDeedService } from '../good-deed/good-deed.service';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    private readonly userService: UserService,
    private readonly goodDeedService: GoodDeedService,
  ) {}

  async getFriendshipInfo(user: User): Promise<{
    outgoing: { id: number; user: Pick<User, 'id' | 'username'> }[];
    incoming: { id: number; user: Pick<User, 'id' | 'username'> }[];
    friendships: { id: number; user: Pick<User, 'id' | 'username'> }[];
  }> {
    const outgoingRequests = await this.friendshipRepository.find({
      where: { user, status: 'pending' },
      relations: ['friend'],
    });

    const incomingRequests = await this.friendshipRepository.find({
      where: { friend: user, status: 'pending' },
      relations: ['user'],
    });

    const acceptedFriendships = await this.friendshipRepository.find({
      where: [
        { user, status: 'accepted' },
        { friend: user, status: 'accepted' },
      ],
      relations: ['user', 'friend'],
    });

    return {
      outgoing: outgoingRequests.map(({ id, friend }) => ({
        id,
        user: { id: friend.id, username: friend.username },
      })),
      incoming: incomingRequests.map(({ id, user }) => ({
        id,
        user: { id: user.id, username: user.username },
      })),
      friendships: acceptedFriendships.map((friendship) => ({
        id: friendship.id,
        user: {
          id:
            friendship.user.id === user.id
              ? friendship.friend.id
              : friendship.user.id,
          username:
            friendship.user.id === user.id
              ? friendship.friend.username
              : friendship.user.username,
        },
      })),
    };
  }

  async createFriendship(
    addFriendDto: AddFriendDto,
    user: User,
  ): Promise<Friendship> {
    const friend = await this.userService.findOneByUsername(
      addFriendDto.username,
    );

    if (!friend) {
      throw new NotFoundException('User not found');
    }
    if (friend.id === user.id) {
      throw new ConflictException('You cannot add yourself as a friend');
    }

    const existingFriendship = await this.friendshipRepository.findOne({
      where: { user, friend },
    });

    if (existingFriendship) {
      throw new ConflictException(
        'You are already created friend request with this user',
      );
    }

    const friendship = this.friendshipRepository.create({ user, friend });
    const result = await this.friendshipRepository.save(friendship);
    result.user = result.friend;
    delete result.friend;
    delete result.user.password;

    return result;
  }

  async acceptFriendship(id: number, user: User): Promise<Friendship> {
    const friendship = await this.friendshipRepository.findOne({
      where: { id },
      relations: ['user', 'friend'],
    });

    if (friendship.friend.id !== user.id) {
      throw new NotFoundException('This request was not sent to you');
    }
    if (friendship.status === 'accepted') {
      throw new ConflictException('You are already friends with this user');
    }

    friendship.status = 'accepted';
    return this.friendshipRepository.save(friendship);
  }

  async deleteFriendship(id: number, user: User): Promise<void> {
    const friendship = await this.friendshipRepository.findOne({
      where: { id },
      relations: ['user', 'friend'],
    });

    if (friendship.user.id !== user.id && friendship.friend.id !== user.id) {
      throw new NotFoundException('This is not your friendship');
    }

    const result = await this.friendshipRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException('Friendship not found');
    }
  }

  async findFriendByUsername(username: string, user: User) {
    const friend = await this.userService.findOneByUsername(username);

    if (!friend) {
      throw new NotFoundException('User not found');
    }

    const friendship = await this.friendshipRepository.findOne({
      where: [
        { user, friend, status: 'accepted' },
        { user: friend, friend: user, status: 'accepted' },
      ],
    });

    if (!friendship) {
      throw new NotFoundException('You are not friends with this user');
    }

    return await this.goodDeedService.findAllByUser(friend);
  }
}
