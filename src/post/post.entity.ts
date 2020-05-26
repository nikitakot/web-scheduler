import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'post' })
export class PostEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  body: string;

  @ManyToOne(type => UserEntity, user => user.post)
  author: UserEntity;
}
