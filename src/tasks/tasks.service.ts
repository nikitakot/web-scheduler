import {
  HttpService,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitoredEndpointEntity } from '../monitored-endpoint/monitored-endpoint.entity';
import { Repository } from 'typeorm';
import { MonitoringResultEntity } from '../monitoring-result/monitoring-result.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MONITORING_TASK_PREFIX } from '../shared/constants/constants';

@Injectable()
export class TasksService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(MonitoredEndpointEntity)
    private monitoredEndpointRepository: Repository<MonitoredEndpointEntity>,
    @InjectRepository(MonitoringResultEntity)
    private monitoringResultRepository: Repository<MonitoringResultEntity>,
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService,
  ) {}

  async onApplicationBootstrap() {
    Logger.warn('Initializing intervals');
    const monitoredEndpoints = await this.monitoredEndpointRepository.find({
      disabled: false,
    });
    for (const monitoredEndpoint of monitoredEndpoints) {
      this.addInterval(monitoredEndpoint);
    }
  }

  private addInterval(entity: MonitoredEndpointEntity) {
    const name = `${MONITORING_TASK_PREFIX}${entity.id}`;
    Logger.warn(`Initializing intervals ${name}`);
    const callback = async () => {
      Logger.warn(
        `Interval ${name} executing at time (${entity.monitoredInterval})!`,
      );
      try {
        const response = await this.httpService.get(entity.url).toPromise();
        await this.monitoringResultRepository.save({
          statusCode: response.status,
          monitoredEndpoint: { id: entity.id },
          payload: response.data,
        });
        Logger.log(`Interval ${name} successfully executed!`);
      } catch (e) {
        Logger.error('Monitoring error', e); // TODO smarter error handling maybe retry
      }
    };

    const interval = setInterval(callback, entity.monitoredInterval * 1000);
    this.schedulerRegistry.addInterval(name, interval);
  }

  private deleteInterval(entityId: string) {
    const name = `${MONITORING_TASK_PREFIX}${entityId}`;
    this.schedulerRegistry.deleteInterval(name);
    Logger.warn(`Interval ${name} deleted!`);
  }

  private getInterval(entityId: string) {
    const name = `${MONITORING_TASK_PREFIX}${entityId}`;
    try {
      return this.schedulerRegistry.getInterval(name);
    } catch (e) {
      Logger.warn(`Interval ${name} does not exist`, e);
      return undefined;
    }
  }

  schedule(entity: MonitoredEndpointEntity) {
    const interval = this.getInterval(entity.id);
    if (interval) {
      this.deleteInterval(entity.id);
    }
    if (!entity.disabled) {
      this.addInterval(entity);
    }
  }
}
