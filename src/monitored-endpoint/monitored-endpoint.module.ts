import { Module } from '@nestjs/common';
import { MonitoredEndpointResolver } from './monitored-endpoint.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoredEndpointEntity } from './monitored-endpoint.entity';
import { MonitoringResultEntity } from '../monitoring-result/monitoring-result.entity';

@Module({
  providers: [MonitoredEndpointResolver],
  imports: [
    TypeOrmModule.forFeature([MonitoredEndpointEntity, MonitoringResultEntity]),
  ],
  exports: [TypeOrmModule],
})
export class MonitoredEndpointModule {}
