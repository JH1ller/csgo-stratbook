import faker from 'faker';

import { req, apiConfig } from './config';
import { createLoginAccount, performLocalAuthentication, generateEmail, generatePassword } from './utils';

import { UsersApiAxiosParamCreator, ForgotPasswordResponse, ResetPasswordDto } from './api';

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

  test.concurrent.each([
    './test/images/avatar-64x64.jpg',
    './test/images/test_01.gif',
    './test/images/test_01.jpg',
    './test/images/test_01.png',
    './test/images/test_01.webp',
  ])('register user - avatar %s', async (image: string) => {
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

  test.concurrent.each([
    './test/images/invalid-image-01.txt',
    './test/images/invalid-image-02.zip',
    './test/images/invalid-image-03.bin',
  ])('register user - avatar invalid file type (%s)', async (image: string) => {
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
    return req //
      .get(route.url)
      .expect(401);
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

  it('request forgot-password', async () => {
    const { email } = await createLoginAccount();

    const forgotPasswordArgs = {
      email,
      captchaResponse: '11112222333',
    };

    const forgotPassword = await UsersApiAxiosParamCreator(apiConfig).usersControllerForgotPassword(forgotPasswordArgs);
    let token = '';
    await req
      .post(forgotPassword.url)
      .set('Accept', 'application/json')
      .send(forgotPasswordArgs)
      .expect(201)
      .expect((result) => {
        const body = result.body as ForgotPasswordResponse;

        expect(body).toHaveProperty('token');

        token = body.token;
      });

    const resetPasswordArgs: ResetPasswordDto = {
      password: generatePassword(),
      token,
      captchaResponse: '12341234',
    };

    const resetPassword = await UsersApiAxiosParamCreator(apiConfig).usersControllerResetPassword(resetPasswordArgs);
    await req
      .patch(resetPassword.url) //
      .set('Accept', 'application/json')
      .send(resetPasswordArgs)
      .expect(200);

    const { cookies } = await performLocalAuthentication(email, resetPasswordArgs.password);
    const { url } = await UsersApiAxiosParamCreator(apiConfig).usersControllerGetUser();
    await req
      .get(url)
      .set('Cookie', cookies)
      .expect(200)
      .expect((result) => {
        expect(result.body).toHaveProperty('email');
        expect(result.body.email).toBe(email);
      });
  });
});
