import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post } from '../graphql.schema.generated';
import { GqlUser } from '../shared/decorators/decorators';
import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { GqlAuthGuard } from '../auth/graphql-auth.guard';
import { PostInputDto, UpdatePostInputDto } from './post-input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from '../user/user.entity';

@Resolver(Post)
export class PostResolver {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  @Query()
  async post(@Args('id') id: string) {
    return this.postRepository.findOne(id);
  }

  @Query()
  async posts() {
    return this.postRepository.find();
  }

  @ResolveField()
  async author(@Parent() { id }: Post) {
    return (await this.postRepository.findOne(id, { relations: ['author'] }))
      .author;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('postInput') { title, body }: PostInputDto,
    @GqlUser() user: UserEntity,
  ) {
    return this.postRepository.save({
      title,
      body,
      author: { id: user.id },
    });
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('updatePostInput') { id, title, body }: UpdatePostInputDto,
    @GqlUser() user: UserEntity,
  ) {
    const post = await this.postRepository.findOne(id, {
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (post.author.id !== user.id) {
      throw new ForbiddenException();
    }

    return this.postRepository.save({
      id,
      title,
      body,
    });
  }
}
