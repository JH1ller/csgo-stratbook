import { Test, TestingModule } from '@nestjs/testing';
import { StrategiesController } from './strategies.controller';

describe('StrategiesController', () => {
  let controller: StrategiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StrategiesController],
    }).compile();

    controller = module.get<StrategiesController>(StrategiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
