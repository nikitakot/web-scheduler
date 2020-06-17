import {
  MonitoredEndpointInput,
  UpdateMonitoredEndpointInput,
} from '../graphql.schema.generated';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class MonitoredEndpointDto extends MonitoredEndpointInput {
  @IsNotEmpty()
  name: string;

  @IsUrl({ require_protocol: true })
  url: string;

  @IsInt()
  monitoredInterval: number;

  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
}

export class UpdateMonitoredEndpointDto extends UpdateMonitoredEndpointInput {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsUrl({ require_valid_protocol: true })
  @IsOptional()
  url: string;

  @IsInt()
  @IsOptional()
  monitoredInterval: number;

  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
}
