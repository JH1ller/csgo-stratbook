import { Test, TestingModule } from '@nestjs/testing';
import { AdministrationController } from './administration.controller';

describe('AdministrationController', () => {
  let controller: AdministrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdministrationController],
    }).compile();

    controller = module.get<AdministrationController>(AdministrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
