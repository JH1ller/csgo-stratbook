import faker from 'faker';

import { req, apiConfig } from './config';
import { generatePassword, createLoginAccount } from './utils';

import { AuthApiAxiosParamCreator } from './api';

describe('Auth integration', () => {
  it('local sign in (user does not exist)', async () => {
    const route = await AuthApiAxiosParamCreator(apiConfig).authControllerLogin({
      email: faker.internet.email(),
      password: generatePassword(),
    });

    return req.post(route.url).send(route.options.data).set('Accept', 'application/json').expect(401);
  });

  it('logout (not signed in)', async () => {
    const route = await AuthApiAxiosParamCreator(apiConfig).authControllerLogout();

    return req.post(route.url).expect(401);
  });

  it('logout invalid cookie sid', async () => {
    const route = await AuthApiAxiosParamCreator(apiConfig).authControllerLogout();

    return req
      .post(route.url)
      .set('Cookie', [`sid=${faker.internet.password(12)}`])
      .expect(401);
  });

  it('login logout (create account)', async () => {
    const { cookies } = await createLoginAccount();

    const logoutRoute = await AuthApiAxiosParamCreator(apiConfig).authControllerLogout();
    return req.post(logoutRoute.url).send(logoutRoute.options.data).set('Cookie', [cookies]).expect(201);
  });

  it('logout destroy session', async () => {
    const { cookies } = await createLoginAccount();

    const logoutRoute = await AuthApiAxiosParamCreator(apiConfig).authControllerLogout();
    await req.post(logoutRoute.url).send(logoutRoute.options.data).set('Cookie', [cookies]).expect(201);

    // now we the route guard should kick in
    return req.post(logoutRoute.url).send(logoutRoute.options.data).set('Cookie', [cookies]).expect(401);
  });
});
