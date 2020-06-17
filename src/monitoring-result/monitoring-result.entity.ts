import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { MonitoredEndpointEntity } from '../monitored-endpoint/monitored-endpoint.entity';

@Entity({ name: 'monitored-result' })
export class MonitoringResultEntity extends BaseEntity {
  @Column()
  statusCode: number;

  @Column()
  payload: string;

  @Column({ type: 'timestamptz', nullable: true })
  checkedAt?: Date;

  @ManyToOne(
    type => MonitoredEndpointEntity,
    monitoredEndpoint => monitoredEndpoint.monitoringResult,
  )
  monitoredEndpoint: MonitoredEndpointEntity;
}
