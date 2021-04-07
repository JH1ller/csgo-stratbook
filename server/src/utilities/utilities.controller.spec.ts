import { Test, TestingModule } from '@nestjs/testing';
import { UtilitiesController } from './utilities.controller';

describe('UtilitiesController', () => {
  let controller: UtilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilitiesController],
    }).compile();

    controller = module.get<UtilitiesController>(UtilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
