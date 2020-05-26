import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { createPost, signup } from './gql/queries';
import * as cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dummyUser: { email: string; token: string };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    const email = 'test@user.com';
    const token = (await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: signup(email, 'password'),
      })).header['set-cookie'][0]
      .split(';')[0]
      .replace('token=', '');
    dummyUser = { email, token };
  });

  afterAll(async () => {
    const db = app.get(Connection);
    await db.close();
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
          query: signup('email@email.com', 'password'),
        })
        .expect(({ body, header }) => {
          expect(body.data.signup.id).toBeDefined();
          expect(header['set-cookie'][0]).toEqual(
            expect.stringContaining('token'),
          );
        });
    });
  });

  describe('post', () => {
    it('should create post', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Cookie', [`token=${dummyUser.token}`])
        .send({
          query: createPost('new interesting post', 'new body'),
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.createPost.id).toBeDefined();
          expect(body.data.createPost.title).toEqual('new interesting post');
          expect(body.data.createPost.author.email).toEqual(dummyUser.email);
        });
    });
  });
});
