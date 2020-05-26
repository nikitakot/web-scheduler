import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  providers: [UserResolver],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
