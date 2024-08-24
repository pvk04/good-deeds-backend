import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodDeedService } from './good-deed.service';
import { GoodDeedController } from './good-deed.controller';
import { GoodDeed } from './good-deed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoodDeed])],
  providers: [GoodDeedService],
  controllers: [GoodDeedController],
  exports: [GoodDeedService],
})
export class GoodDeedModule {}
