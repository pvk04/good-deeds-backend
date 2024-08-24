import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get(':username/good-deeds')
  async getFriendsGoodDeeds(
    @Param('username') username: string,
    @Req() { user },
  ) {
    return this.friendshipService.findFriendByUsername(username, user);
  }

  @Get()
  async getFriendship(@Req() { user }) {
    return this.friendshipService.getFriendshipInfo(user);
  }

  @Post()
  async createFriendship(@Body() addFriendDto: AddFriendDto, @Req() { user }) {
    return await this.friendshipService.createFriendship(addFriendDto, user);
  }

  @Patch(':id')
  async acceptFriendship(@Param('id') id: number, @Req() { user }) {
    return this.friendshipService.acceptFriendship(id, user);
  }

  @Delete(':id')
  async deleteFriendship(@Param('id') id: number, @Req() { user }) {
    return this.friendshipService.deleteFriendship(id, user);
  }
}
