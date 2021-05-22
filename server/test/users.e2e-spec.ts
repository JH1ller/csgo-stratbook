import request = require('supertest');

import { Test } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { ServerEntry } from 'src/main';

describe('UsersController (e2e)', () => {
  let entry: ServerEntry;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider(ImageUploaderService)
      // .useClass(ImageUploaderServerMock)
      .compile();

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

  it('/ (GET)', () => {
    return request(entry.app.getHttpServer()).get('/users/confirm/email/25000').expect(404);
  });
});
