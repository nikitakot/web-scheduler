import { Test, TestingModule } from '@nestjs/testing';
import { MonitoredEndpointResolver } from './monitored-endpoint.resolver';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MonitoredEndpointEntity } from './monitored-endpoint.entity';
import { Repository } from 'typeorm';
import { MonitoringResultEntity } from '../monitoring-result/monitoring-result.entity';
import { TasksService } from '../tasks/tasks.service';

describe.only('MonitoredEndpointResolver', () => {
  type MockType<T> = { [P in keyof T]: jest.Mock<{}> };

  const repositoryMockFactory: () => MockType<
    Partial<Repository<any>>
  > = jest.fn(() => ({
    findOne: jest.fn(entity => entity),
    save: jest.fn(entity => entity),
  }));

  const mockTaskService = jest.fn(() => ({
    schedule: jest.fn(p => p),
  }));

  const user = {
    id: 'dummy',
    email: 'dummy',
    monitoredEndpoint: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    username: 'adads',
    password: 'asdasd',
  };

  const endpoint = {
    name: 'name',
    url: 'google.com',
    monitoredInterval: 20,
  };

  let resolver: MonitoredEndpointResolver;
  let entityReposMock: MockType<Repository<MonitoredEndpointEntity>>;
  let resultReposMock: MockType<Repository<MonitoringResultEntity>>;
  let taskService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitoredEndpointResolver,
        {
          provide: TasksService,
          useClass: mockTaskService,
        },
        {
          provide: getRepositoryToken(MonitoredEndpointEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(MonitoringResultEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    resolver = module.get<MonitoredEndpointResolver>(MonitoredEndpointResolver);
    entityReposMock = module.get(getRepositoryToken(MonitoredEndpointEntity));
    resultReposMock = module.get(getRepositoryToken(MonitoringResultEntity));
    taskService = module.get(TasksService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create endpoint and schedule task', async () => {
    entityReposMock.findOne.mockReturnValue(endpoint);
    await resolver.createMonitoredEndpoint(endpoint, user);
    expect(entityReposMock.save).toHaveBeenCalledWith({
      ...endpoint,
      owner: { id: user.id },
    });
    expect(taskService.schedule).toHaveBeenCalledWith(endpoint);
  });
});
