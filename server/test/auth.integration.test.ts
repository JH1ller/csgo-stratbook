import faker from 'faker';
import { req, configuration } from './config';

import { AuthApiAxiosParamCreator } from './api';

describe('Auth integration', () => {
  it('local sign in (user does not exist)', async () => {
    const route = await AuthApiAxiosParamCreator(configuration).authControllerLogin({
      email: faker.internet.email(),
      password: 'A' + faker.internet.password(12) + '1',
    });

    return req.post(route.url).send(route.options.data).set('Accept', 'application/json').expect(401);
  });

  it('logout (not signed in)', async () => {
    const route = await AuthApiAxiosParamCreator(configuration).authControllerLogout();

    return req.post(route.url).expect(401);
  });
});
