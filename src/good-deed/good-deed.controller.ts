import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GoodDeedService } from './good-deed.service';
import { CreateGoodDeedDto } from './dto/create-good-deed.dto';
import { UpdateGoodDeedDto } from './dto/update-good-deed.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { User } from '../user/user.entity';
import { GoodDeed } from './good-deed.entity';

@Controller('good-deeds')
@UseGuards(JwtAuthGuard)
export class GoodDeedController {
  constructor(private readonly goodDeedService: GoodDeedService) {}

  @Get()
  async getAllGoodDeeds(@Req() { user }): Promise<GoodDeed[]> {
    return this.goodDeedService.findAllByUser(user);
  }

  @Post()
  async createGoodDeed(
    @Body() createGoodDeedDto: CreateGoodDeedDto,
    @Req() { user },
  ): Promise<GoodDeed> {
    return this.goodDeedService.create(createGoodDeedDto, user);
  }

  @Patch(':id')
  async updateGoodDeed(
    @Param('id') id: number,
    @Body() updateGoodDeedDto: UpdateGoodDeedDto,
    @Req() { user },
  ): Promise<GoodDeed> {
    return this.goodDeedService.update(id, updateGoodDeedDto, user);
  }

  @Delete(':id')
  async deleteGoodDeed(
    @Param('id') id: number,
    @Req() { user },
  ): Promise<void> {
    return this.goodDeedService.remove(id, user);
  }
}
