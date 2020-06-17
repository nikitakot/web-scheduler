import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { UserEntity } from '../user/user.entity';
import { MonitoringResultEntity } from '../monitoring-result/monitoring-result.entity';

@Entity({ name: 'monitored-endpoint' })
export class MonitoredEndpointEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  monitoredInterval: number;

  @Column({ default: false })
  disabled: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  checkedAt?: Date;

  @ManyToOne(type => UserEntity, user => user.monitoredEndpoint)
  owner: UserEntity;

  @OneToMany(
    type => MonitoringResultEntity,
    monitoringResult => monitoringResult.monitoredEndpoint,
  )
  monitoringResult: MonitoringResultEntity;
}
