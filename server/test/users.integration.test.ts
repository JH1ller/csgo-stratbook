import { req, apiConfig } from './config';
import { createLoginAccount, TestUser } from './utils';

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
});
