import { forwardRef, Module } from '@nestjs/common';
import { MonitoredEndpointResolver } from './monitored-endpoint.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoredEndpointEntity } from './monitored-endpoint.entity';
import { MonitoringResultEntity } from '../monitoring-result/monitoring-result.entity';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  providers: [MonitoredEndpointResolver],
  imports: [
    // TODO - minor - find a way how to create MonitoringResult repository
    //  in MonitoringResult module and share it here without circular dep
    TypeOrmModule.forFeature([MonitoredEndpointEntity, MonitoringResultEntity]),
    forwardRef(() => TasksModule),
  ],
  exports: [TypeOrmModule],
})
export class MonitoredEndpointModule {}
