import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async validate({ id }): Promise<UserEntity> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw Error('Authenticate validation error');
    }
    return user;
  }
}
