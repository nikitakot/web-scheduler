import { IsString, MaxLength, MinLength } from 'class-validator';
import { PostInput, UpdatePostInput } from '../graphql.schema.generated';

export class PostInputDto extends PostInput {
  @IsString()
  @MinLength(10)
  @MaxLength(60)
  readonly title: string;
}

export class UpdatePostInputDto extends UpdatePostInput {
  @IsString()
  @MinLength(10)
  @MaxLength(60)
  readonly title: string;
}
