import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { MonitoredEndpointEntity } from '../monitored-endpoint/monitored-endpoint.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(
    type => MonitoredEndpointEntity,
    monitoredEndpoint => monitoredEndpoint.owner,
  )
  monitoredEndpoint: MonitoredEndpointEntity[];
}
