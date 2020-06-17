import { Module, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlOptions } from './graphql.options';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoredEndpointModule } from './monitored-endpoint/monitored-endpoint.module';
import { MonitoringResultModule } from './monitoring-result/monitoring-result.module';
import TypeOrmOptions from './typeorm.options';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphqlOptions,
    }),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: TypeOrmOptions,
    }),
    MonitoredEndpointModule,
    MonitoringResultModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
