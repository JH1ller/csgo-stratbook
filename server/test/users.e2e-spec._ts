import request = require('supertest');
import faker from 'faker';

import { Test } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { ServerEntry } from 'src/main';

import { LocalSignInDto, UsersApiUsersControllerRegisterUserRequest } from './api';

describe('UsersController (e2e)', () => {
  let entry: ServerEntry;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const fixture = moduleFixture.createNestApplication();
    entry = new ServerEntry(fixture);
    await entry.configure();
    await entry.app.init();
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      entry
        .dispose()
        .then(() => resolve())
        .catch((error) => {
          console.log(error);
          resolve();
        });
    });
  });

  it('/confirm/email/ (GET) null token', () => {
    return request(entry.app.getHttpServer()).get('/api/users/confirm/email/').expect(404);
  });

  it('/confirm/update-email/{token} (GET) null token', () => {
    return request(entry.app.getHttpServer()).get('/api/users/confirm/update-email/').expect(404);
  });

  it('/ (GET) unauthorized', () => {
    return request(entry.app.getHttpServer()).get('/api/users').expect(401);
  });

  it('/ (DELETE) unauthorized', () => {
    return request(entry.app.getHttpServer()).delete('/api/users').expect(401);
  });

  it('register user (no avatar)', () => {
    const data: UsersApiUsersControllerRegisterUserRequest = {
      userName: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    return request(entry.app.getHttpServer()).post('/api/users/register').send(data).expect(201);
  });

  it('register user (avatar)', () => {
    const data: UsersApiUsersControllerRegisterUserRequest = {
      userName: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // const filePath = path.resolve((global as any).ROOT_DIR, '/test/images/test_01.jpg');
    // console.log(filePath);
    // const stream = fs.createReadStream(filePath);

    try {
      return (
        request(entry.app.getHttpServer())
          .post('/api/users/register')
          .field('userName', data.userName)
          .field('email', data.email)
          .field('password', data.password)
          // .attach('avatar', stream);
          .expect(201)
      );
    } finally {
      // stream.close();
    }
  });

  it('register user and login', async () => {
    const data: UsersApiUsersControllerRegisterUserRequest = {
      userName: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await request(entry.app.getHttpServer()).post('/api/users/register').send(data).expect(201);

    const signInData: LocalSignInDto = {
      email: data.email,
      password: data.password,
    };

    return request(entry.app.getHttpServer()).post('/api/auth/local/signin').send(signInData).expect(200);
  });

  it('register, login and fetch user data', async () => {
    const data: UsersApiUsersControllerRegisterUserRequest = {
      userName: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await request(entry.app.getHttpServer()).post('/api/users/register').send(data).expect(201);

    const signInData: LocalSignInDto = {
      email: data.email,
      password: data.password,
    };

    const agent = request.agent(entry.app.getHttpServer());

    await agent.post('/api/auth/local/signin').send(signInData).expect(200);

    return agent.get('/api/users/').expect(200);
  });
});
