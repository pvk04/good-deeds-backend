import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() { user }) {
    delete user.password;
    return user;
  }

  @Patch()
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() user: User) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete()
  async deleteUser(@Req() { user }) {
    return this.userService.remove(user.id);
  }
}
