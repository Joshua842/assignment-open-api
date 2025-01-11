import { Test, TestingModule } from '@nestjs/testing';
import { MyanimeController } from './myanime.controller';

describe('MyanimeController', () => {
  let controller: MyanimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyanimeController],
    }).compile();

    controller = module.get<MyanimeController>(MyanimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
