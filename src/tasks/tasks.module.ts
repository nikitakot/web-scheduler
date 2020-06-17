import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MonitoredEndpointModule } from '../monitored-endpoint/monitored-endpoint.module';

@Module({
  providers: [TasksService],
  imports: [forwardRef(() => MonitoredEndpointModule), HttpModule],
  exports: [TasksService],
})
export class TasksModule {}
