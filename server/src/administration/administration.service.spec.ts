import { Test, TestingModule } from '@nestjs/testing';
import { AdministrationService } from './administration.service';

describe('AdministrationService', () => {
  let service: AdministrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdministrationService],
    }).compile();

    service = module.get<AdministrationService>(AdministrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
