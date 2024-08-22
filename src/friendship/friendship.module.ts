import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { Friendship } from './friendship.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship]), UserModule],
  providers: [FriendshipService],
  controllers: [FriendshipController],
})
export class FriendshipModule {}
