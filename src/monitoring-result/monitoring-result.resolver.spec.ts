import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringResultResolver } from './monitoring-result.resolver';

describe('MonitoringResultResolver', () => {
  let resolver: MonitoringResultResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringResultResolver],
    }).compile();

    resolver = module.get<MonitoringResultResolver>(MonitoringResultResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
