import { Test, TestingModule } from '@nestjs/testing';
import { GoodDeedController } from './good-deed.controller';

describe('GoodDeedController', () => {
  let controller: GoodDeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodDeedController],
    }).compile();

    controller = module.get<GoodDeedController>(GoodDeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
