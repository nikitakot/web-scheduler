import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitoredEndpointEntity } from './monitored-endpoint.entity';
import { Like, Repository } from 'typeorm';
import { MonitoredEndpoint } from '../graphql.schema.generated';
import { MonitoringResultEntity } from '../monitoring-result/monitoring-result.entity';
import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { GqlAuthGuard } from '../auth/graphql-auth.guard';
import { GqlUser } from '../shared/decorators/decorators';
import { UserEntity } from '../user/user.entity';
import {
  MonitoredEndpointDto,
  UpdateMonitoredEndpointDto,
} from './monitored-endpoint.dto';

@Resolver(MonitoredEndpoint)
export class MonitoredEndpointResolver {
  constructor(
    @InjectRepository(MonitoredEndpointEntity)
    private monitoredEndpointRepository: Repository<MonitoredEndpointEntity>,
    @InjectRepository(MonitoringResultEntity)
    private monitoringResultRepository: Repository<MonitoringResultEntity>,
  ) {}

  @ResolveField()
  async owner(@Parent() { id }: MonitoredEndpoint) {
    return this.monitoredEndpointRepository.findOne(id, {
      relations: ['owner'],
    });
  }

  @ResolveField()
  async monitoringResult(
    @Args('first') first: number,
    @Parent() { id }: MonitoredEndpoint,
  ) {
    return this.monitoringResultRepository.find({
      take: first,
      order: { createdAt: 'DESC' }, // TODO might be not performant, index the column
      where: { monitoredEndpoint: { id } },
    });
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async monitoredEndpoint(@Args('id') id: string, @GqlUser() user: UserEntity) {
    return this.monitoredEndpointRepository.findOne(id, {
      where: { owner: { id: user.id } },
    });
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async monitoredEndpoints(@GqlUser() user: UserEntity) {
    return this.monitoredEndpointRepository.find({ owner: { id: user.id } });
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async findMonitoredEndpoints(
    @Args('url') url: string,
    @GqlUser() user: UserEntity,
  ) {
    return this.monitoredEndpointRepository.find({
      owner: { id: user.id },
      url: Like(`%${url}%`),
    }); // TODO replace with full text search
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createMonitoredEndpoint(
    @Args('monitoredEndpointInput')
    monitoredEndpointInput: MonitoredEndpointDto,
    @GqlUser() user: UserEntity,
  ) {
    return this.monitoredEndpointRepository.save({
      ...monitoredEndpointInput,
      owner: { id: user.id },
    });
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateMonitoredEndpoint(
    @Args('updateMonitoredEndpointInput')
    updateMonitoredEndpointInput: UpdateMonitoredEndpointDto,
    @GqlUser() user: UserEntity,
  ) {
    const monitoredEndpoint = await this.monitoredEndpointRepository.findOne(
      updateMonitoredEndpointInput.id,
      { relations: ['owner'] },
    );

    if (!monitoredEndpoint) {
      throw new NotFoundException();
    }

    if (monitoredEndpoint.owner.id !== user.id) {
      throw new ForbiddenException();
    }

    return this.monitoredEndpointRepository.save({
      ...updateMonitoredEndpointInput,
    });
  }
}
