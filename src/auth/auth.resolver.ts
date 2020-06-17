import * as bcryptjs from 'bcryptjs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginInput } from '../graphql.schema.generated';
import { JwtService } from '@nestjs/jwt';
import { SignUpInputDto } from './sign-up-input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly jwt: JwtService,
  ) {}

  @Mutation()
  async login(@Args('loginInput') { email, password }: LoginInput) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw Error('Email or password incorrect');
    }

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      throw Error('Email or password incorrect');
    }

    const jwt = this.jwt.sign({ id: user.id });

    return { ...user, jwt };
  }

  @Mutation()
  async signup(@Args('signUpInput') signUpInputDto: SignUpInputDto) {
    const emailExists = !!(await this.usersRepository.findOne({
      email: signUpInputDto.email,
    }));
    if (emailExists) {
      throw Error('Email is already in use');
    }

    const usernameExists = !!(await this.usersRepository.findOne({
      username: signUpInputDto.username,
    }));
    if (usernameExists) {
      throw Error('Username is already taken');
    }

    const password = await bcryptjs.hash(signUpInputDto.password, 10);

    const user = await this.usersRepository.save({
      ...signUpInputDto,
      password,
    });

    const jwt = this.jwt.sign({ id: user.id });

    return { ...user, jwt };
  }
}
