import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';

@Module({
  providers: [PostResolver],
  imports: [TypeOrmModule.forFeature([PostEntity])],
})
export class PostModule {}
