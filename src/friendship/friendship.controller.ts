import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/user.entity';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  async addFriend(
    @Body() addFriendDto: AddFriendDto,
    @Req() { user },
  ): Promise<string> {
    await this.friendshipService.addFriend(addFriendDto, user);
    return 'Friend added successfully';
  }

  @Get()
  async getFriends(@Req() { user }): Promise<User[]> {
    return this.friendshipService.getFriends(user);
  }
}
