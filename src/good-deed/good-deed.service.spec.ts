import { Test, TestingModule } from '@nestjs/testing';
import { GoodDeedService } from './good-deed.service';

describe('GoodDeedService', () => {
  let service: GoodDeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodDeedService],
    }).compile();

    service = module.get<GoodDeedService>(GoodDeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
