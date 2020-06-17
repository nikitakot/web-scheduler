import {
  MonitoredEndpointInput,
  UpdateMonitoredEndpointInput,
} from '../graphql.schema.generated';
import { IsBoolean, IsInt, IsNotEmpty, IsUrl, IsUUID } from 'class-validator';

export class MonitoredEndpointDto extends MonitoredEndpointInput {
  @IsNotEmpty()
  name: string;

  @IsUrl()
  url: string;

  @IsInt()
  monitoredInterval: number;

  @IsBoolean()
  disabled?: boolean;
}

export class UpdateMonitoredEndpointDto extends UpdateMonitoredEndpointInput {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsUrl()
  url: string;

  @IsInt()
  monitoredInterval: number;

  @IsBoolean()
  disabled?: boolean;
}
