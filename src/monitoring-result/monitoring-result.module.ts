import { Module } from '@nestjs/common';
import { MonitoringResultResolver } from './monitoring-result.resolver';
import { MonitoredEndpointModule } from '../monitored-endpoint/monitored-endpoint.module';

@Module({
  providers: [MonitoringResultResolver],
  imports: [MonitoredEndpointModule],
})
export class MonitoringResultModule {}
