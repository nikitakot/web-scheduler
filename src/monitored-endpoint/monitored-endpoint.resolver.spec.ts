import { Test, TestingModule } from '@nestjs/testing';
import { MonitoredEndpointResolver } from './monitored-endpoint.resolver';

describe('MonitoredEndpointResolver', () => {
  let resolver: MonitoredEndpointResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoredEndpointResolver],
    }).compile();

    resolver = module.get<MonitoredEndpointResolver>(MonitoredEndpointResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
