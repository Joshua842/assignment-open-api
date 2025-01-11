import { Test, TestingModule } from '@nestjs/testing';
import { MyAnimeService } from './myanime.service';

describe('MyAnimeService', () => {
  let service: MyAnimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyAnimeService],
    }).compile();

    service = module.get<MyAnimeService>(MyAnimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
