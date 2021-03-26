import { Test, TestingModule } from '@nestjs/testing';
import { StrategiesService } from './strategies.service';

describe('StrategiesService', () => {
  let service: StrategiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StrategiesService],
    }).compile();

    service = module.get<StrategiesService>(StrategiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
