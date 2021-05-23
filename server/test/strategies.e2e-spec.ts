import request = require('supertest');
import faker from 'faker';

import { Test } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { ServerEntry } from 'src/main';

import { LocalSignInDto, UsersApiUsersControllerRegisterUserRequest } from './api';

describe('StrategyController (e2e)', () => {
  let entry: ServerEntry;

  const data: UsersApiUsersControllerRegisterUserRequest = {
    userName: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const fixture = moduleFixture.createNestApplication();
    entry = new ServerEntry(fixture);
    await entry.configure();
    await entry.app.init();

    // register user
    await request(entry.app.getHttpServer()).post('/api/users/register').send(data).expect(201);

    const signInData: LocalSignInDto = {
      email: data.email,
      password: data.password,
    };

    await request(entry.app.getHttpServer()).post('/api/auth/local/signin').send(signInData).expect(200);
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

  it('test', () => {
    // test
  });
});
