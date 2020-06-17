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
  BadRequestException,
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
import { TasksService } from '../tasks/tasks.service';

@Resolver(MonitoredEndpoint)
export class MonitoredEndpointResolver {
  constructor(
    @InjectRepository(MonitoredEndpointEntity)
    private monitoredEndpointRepository: Repository<MonitoredEndpointEntity>,
    @InjectRepository(MonitoringResultEntity)
    private monitoringResultRepository: Repository<MonitoringResultEntity>,
    private tasksService: TasksService,
  ) {}

  @ResolveField()
  async owner(@Parent() { id }: MonitoredEndpoint) {
    return this.monitoredEndpointRepository.findOne(id, {
      relations: ['owner'],
    });
  }

  @ResolveField()
  async checkedAt(@Parent() { id }: MonitoredEndpoint) {
    const monitoringResult = await this.monitoringResultRepository.findOne({
      order: { createdAt: 'DESC' }, // TODO might be not performant, index the column
      where: { monitoredEndpoint: { id } },
    });

    if (monitoringResult) {
      return monitoringResult.createdAt;
    }
  }

  @ResolveField()
  async monitoringResult(
    @Args('first') first: number,
    @Parent() { id }: MonitoredEndpoint,
  ) {
    if (first < 0) {
      return new BadRequestException('first must not be negative');
    }
    return this.monitoringResultRepository.find({
      take: first,
      order: { createdAt: 'DESC' }, // TODO might be not performant, index the column
      where: { monitoredEndpoint: { id } },
    });
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async monitoredEndpoint(@Args('id') id: string, @GqlUser() user: UserEntity) {
    const monitoredEndpoint = await this.monitoredEndpointRepository.findOne(
      id,
      {
        where: { owner: { id: user.id } },
      },
    );

    if (!monitoredEndpoint) {
      throw new NotFoundException();
    }

    return monitoredEndpoint;
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
    const { id } = await this.monitoredEndpointRepository.save({
      ...monitoredEndpointInput,
      owner: { id: user.id },
    });

    const monitoredEndpoint = await this.monitoredEndpointRepository.findOne(
      id,
    );

    this.tasksService.schedule(monitoredEndpoint);

    return monitoredEndpoint;
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

    await this.monitoredEndpointRepository.save({
      ...updateMonitoredEndpointInput,
    });

    const monitoredEndpointUpdated = await this.monitoredEndpointRepository.findOne(
      updateMonitoredEndpointInput.id,
    );

    this.tasksService.schedule(monitoredEndpointUpdated);

    return monitoredEndpointUpdated;
  }
}
