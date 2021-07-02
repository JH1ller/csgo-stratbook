import faker from 'faker';
import each from 'jest-each';

import { req, apiConfig } from './config';
import { createLoginAccount, TestUser } from './utils';
import { generatePassword } from './helpers';

import { UsersApiAxiosParamCreator } from './api';

describe('Users integration', () => {
  let testUser: TestUser = null;
  beforeAll(async () => {
    testUser = await createLoginAccount();
  });

  it('get user unauthorized', async () => {
    const route = await UsersApiAxiosParamCreator(apiConfig).usersControllerGetUser();

    return req.get(route.url).expect(401);
  });

  it('get user', async () => {
    const route = await UsersApiAxiosParamCreator(apiConfig).usersControllerGetUser();

    return req.get(route.url).set('Cookie', testUser.cookies).expect(200);
  });

  each([
    './test/images/avatar-64x64.jpg',
    './test/images/test_01.webp', // test webp
  ]).test('create user (avatar %s)', async (image: string) => {
    const userName = faker.internet.userName();
    const email = faker.internet.email();
    const password = generatePassword();

    await req
      .post('/api/users/register')
      .type('form')
      // .send({ userName, email, password })
      .field('userName', userName)
      .field('email', email)
      .field('password', password)
      .attach('avatar', image)
      .set('Accept', 'application/json')
      .expect((result) => {
        if (result.status !== 201) {
          console.log(result);
        }
        return true;
      })
      .expect(201)
      .then((result) => {
        expect(result.body.email).toBe(email);
      });
  });
});
