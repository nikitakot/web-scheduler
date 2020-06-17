import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { createMonitoredEndpoint, signup } from './gql/queries';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MONITORING_TASK_PREFIX } from '../src/shared/constants/constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let taskScheduler: SchedulerRegistry;
  let dummyUser: { email: string; token: string; id: string };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    taskScheduler = app.get(SchedulerRegistry);

    const email = 'test@user.com';
    const username = 'test';
    const { id, jwt } = (await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: signup(email, username, 'password'),
      })).body.data.signup;
    dummyUser = { email, token: jwt, id };
  });

  afterAll(async () => {
    const db = app.get(Connection);
    await db.close();

    taskScheduler.getIntervals().forEach(t => taskScheduler.deleteInterval(t));
  });

  it('/livecheck', () => {
    return request(app.getHttpServer())
      .get('/livecheck')
      .expect(200)
      .expect('alive!');
  });

  describe('user', () => {
    it('should signup and set token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signup('email@email.com', 'dummy', 'password'),
        })
        .expect(({ body, header }) => {
          expect(body.data.signup.id).toBeDefined();
          expect(body.data.signup.jwt).toBeDefined();
        });
    });
  });

  describe('monitoring', () => {
    it('should create monitoring endpoint and task', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('authorization', `Bearer ${dummyUser.token}`)
        .send({
          query: createMonitoredEndpoint(
            'new endpoint',
            'https://google.com',
            60,
          ),
        })
        .expect(200)
        .expect(({ body }) => {
          const id = body.data.createMonitoredEndpoint.id;
          expect(id).toBeDefined();
          expect(body.data.createMonitoredEndpoint.createdAt).toBeDefined();
          expect(taskScheduler.getInterval(MONITORING_TASK_PREFIX + id));
        });
    });
  });
});
