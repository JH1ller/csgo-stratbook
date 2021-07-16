import faker from 'faker';
import each from 'jest-each';

import { req, apiConfig } from './config';
import { createLoginAccount, performLocalAuthentication, generateEmail } from './utils';
import { generatePassword } from './helpers';

import { UsersApiAxiosParamCreator, TeamsApiAxiosParamCreator } from './api';

faker.seed(Math.floor(1000_000_000 * Math.random()));

describe('Users integration', () => {
  it('register user - invalid user name', async () => {
    const userName = 'a';
    const email = generateEmail();
    const password = generatePassword();

    await req
      .post('/api/users/register')
      .type('form')
      .send({ userName, email, password })
      .set('Accept', 'application/json')
      .expect(400);
  });

  each([
    './test/images/avatar-64x64.jpg',
    './test/images/test_01.gif',
    './test/images/test_01.jpg',
    './test/images/test_01.png',
    './test/images/test_01.webp',
  ]).test('register user - avatar %s', async (image: string) => {
    const userName = faker.internet.userName();
    const email = generateEmail();
    const password = generatePassword();

    await req
      .post('/api/users/register')
      .type('form')
      .field('userName', userName)
      .field('email', email)
      .field('password', password)
      .attach('avatar', image)
      .set('Accept', 'application/json')
      .expect(201)
      .then((result) => {
        expect(result.body.email).toBe(email);
      });

    const { cookies } = await performLocalAuthentication(email, password);

    const { url } = await UsersApiAxiosParamCreator(apiConfig).usersControllerGetUser();
    await req
      .get(url)
      .set('Cookie', cookies)
      .expect(200)
      .expect((result) => {
        const body = result.body;

        expect(body).toHaveProperty('email');
        expect(body).toHaveProperty('avatar');

        expect(body.email).toBe(email);
        expect(body.avatar).not.toBeNull();
      });
  });

  each([
    './test/images/invalid-image-01.txt',
    './test/images/invalid-image-02.zip',
    './test/images/invalid-image-03.bin',
  ]).test('register user - avatar invalid file type (%s)', async (image: string) => {
    const userName = faker.internet.userName();
    const email = generateEmail();
    const password = generatePassword();

    await req
      .post('/api/users/register')
      .type('form')
      .field('userName', userName)
      .field('email', email)
      .field('password', password)
      .attach('avatar', image)
      .set('Accept', 'application/json')
      .expect(201)
      .then((result) => {
        expect(result.body.email).toBe(email);
      });

    const { cookies } = await performLocalAuthentication(email, password);

    const { url } = await UsersApiAxiosParamCreator(apiConfig).usersControllerGetUser();
    await req
      .get(url)
      .set('Cookie', cookies)
      .expect(200)
      .expect((result) => {
        const body = result.body;

        expect(body).toHaveProperty('email');
        expect(body).not.toHaveProperty('avatar');

        expect(body.email).toBe(email);

        // test if uploaded file has been ignored
        expect(body.avatar).toBeUndefined();
      });
  });

  it('register user - weak password', async () => {
    const userName = faker.internet.userName();
    const email = generateEmail();
    const password = 'weak';

    await req
      .post('/api/users/register')
      .type('form')
      .send({ userName, email, password })
      .set('Accept', 'application/json')
      .expect(400)
      .then((result) => {
        expect(result.body).toHaveProperty('statusCode');
        expect(result.body).toHaveProperty('message');
      });
  });

  it('register user - email in use', async () => {
    const userName = faker.internet.userName();
    const password = generatePassword();

    const { email } = await createLoginAccount();

    await req
      .post('/api/users/register')
      .type('form')
      .send({ userName, email, password })
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('get user - unauthorized', async () => {
    const route = await UsersApiAxiosParamCreator(apiConfig).usersControllerGetUser();
    return req.get(route.url).expect(401);
  });

  it('get user - no team', async () => {
    const { cookies } = await createLoginAccount();

    const { url } = await UsersApiAxiosParamCreator(apiConfig).usersControllerGetUser();

    return req
      .get(url)
      .set('Cookie', cookies)
      .set('Accept', 'application/json')
      .expect(200)
      .expect((result) => {
        expect(result.body).toHaveProperty('id');
        expect(result.body).toHaveProperty('email');
        expect(result.body).not.toHaveProperty('avatar');

        expect(result.body).toHaveProperty('team');
        expect(result.body.team).toBeNull();

        expect(result.body).toHaveProperty('completedTutorial');
        expect(result.body.completedTutorial).toBeFalsy();
      });
  });
});
