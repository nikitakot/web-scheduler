import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonitoringResultEntity } from './monitoring-result.entity';
import { MonitoringResult } from '../graphql.schema.generated';

@Resolver(MonitoringResult)
export class MonitoringResultResolver {
  constructor(
    @InjectRepository(MonitoringResultEntity)
    private monitoringResultRepository: Repository<MonitoringResultEntity>,
  ) {}

  @ResolveField()
  async monitoredEndpoint(@Parent() { id }: MonitoringResult) {
    return (await this.monitoringResultRepository.findOne(id, {
      relations: ['monitoredEndpoint'],
    })).monitoredEndpoint;
  }
}
