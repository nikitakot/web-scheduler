import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../graphql.schema.generated';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Resolver('User')
export class UserResolver {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  @ResolveField()
  async post(@Parent() { id }: User) {
    return (await this.usersRepository.findOne(id, { relations: ['post'] }))
      .post;
  }
}
