import request = require('supertest');
import faker from 'faker';

import { Test } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { ServerEntry } from 'src/main';

import { LocalSignInDto } from './api';

describe('AuthController (e2e)', () => {
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

  it('local sign-in with invalid user data', () => {
    const signInData: LocalSignInDto = {
      email: 'somekindofmail@testmail.ab3',
      password: 'Test01234!',
    };

    return request(entry.app.getHttpServer()).post('/api/auth/local/signin').send(signInData).expect(400);
  });

  it('local sign-in with invalid model', () => {
    const signInData: LocalSignInDto = {
      email: 'not an email',
      password: '2',
    };

    return request(entry.app.getHttpServer()).post('/api/auth/local/signin').send(signInData).expect(400);
  });

  it('logout without login', () => {
    return request(entry.app.getHttpServer()).post('/api/auth/logout').expect(401);
  });
});
