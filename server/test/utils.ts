import faker from 'faker';
import RandExp from 'randexp';
import { AxiosInstance } from 'axios';

import { PasswordPattern } from 'src/common/validation-helpers';

import { req, createAxiosCookieInstance, apiConfig, basePath } from './config';
import { AuthApiFp } from './api';

export function generatePassword() {
  return 'HelloWorld' + new RandExp(PasswordPattern).gen() + '12345678!';
}

export interface TestUser {
  userName: string;

  email: string;

  password: string;

  instance: AxiosInstance;

  cookies: string;
}

/**
 * Generates account data, registers it and signs the account in
 * @returns account data
 */
export async function createLoginAccount(): Promise<TestUser> {
  const userName = faker.internet.userName();
  const email = generateEmail();
  const password = generatePassword();

  await req
    .post('/api/users/register')
    .type('form')
    .send({ userName, email, password })
    .set('Accept', 'application/json')
    .expect(201)
    .then((result) => {
      expect(result.body).toHaveProperty('email');
      expect(result.body).not.toHaveProperty('avatar');

      expect(result.body.email).toBe(email);
    });

  const { instance, cookies } = await performLocalAuthentication(email, password);

  return {
    userName,
    email,
    password,

    instance,
    cookies,
  };
}

/**
 * Performs login on the specified email and password
 * @param email user email
 * @param password user password
 * @returns axios instance and cookies packed as object
 */
export async function performLocalAuthentication(email: string, password: string) {
  const instance = createAxiosCookieInstance();
  const loginRoute = await AuthApiFp(apiConfig).authControllerLogin({ email, password });

  const { status, config } = await loginRoute(instance);

  expect(status).toBe(201);

  if (typeof config.jar === 'boolean') {
    throw new Error('invalid config type');
  }

  const cookies = config.jar.getCookieStringSync(basePath);

  return {
    instance,
    cookies,
  };
}

export function generateEmail() {
  return faker.datatype.number().toString(10) + faker.internet.email();
}

export function generateTeamInfo() {
  return {
    name: faker.fake('{{name.lastName}}{{name.firstName}}') + faker.datatype.number(),
    website: faker.internet.domainName(),
    serverIp: faker.internet.ip(),
    serverPassword: faker.internet.password(),
  };
}
