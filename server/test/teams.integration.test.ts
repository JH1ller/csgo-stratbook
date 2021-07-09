import faker from 'faker';
import each from 'jest-each';

import { req, apiConfig } from './config';
import { createLoginAccount, TestUser, generateTeamInfo } from './utils';
import { generatePassword } from './helpers';

import { UsersApiAxiosParamCreator, TeamsApiAxiosParamCreator, GetTeamResponse } from './api';

describe('Teams integration', () => {
  let activeUser: TestUser;

  beforeEach(async () => {
    activeUser = await createLoginAccount();
  });

  it('team create - no avatar', async () => {
    const { name, website, serverIp, serverPassword } = generateTeamInfo();

    await req
      .post('/api/teams/create')
      .type('form')
      .set('Cookie', activeUser.cookies)
      .send({ name, website, serverIp, serverPassword })
      .set('Accept', 'application/json')
      .expect(201);

    const { url } = await UsersApiAxiosParamCreator(apiConfig).usersControllerGetUser();

    return req
      .get(url)
      .set('Cookie', activeUser.cookies)
      .set('Accept', 'application/json')
      .expect(200)
      .expect((result) => {
        expect(result.body).toHaveProperty('id');
        expect(result.body).toHaveProperty('email');
        expect(result.body).not.toHaveProperty('avatar');

        expect(result.body).toHaveProperty('team');
        expect(result.body.team).not.toBeNull();

        expect(result.body).toHaveProperty('completedTutorial');
        expect(result.body.completedTutorial).toBeFalsy();
      });
  });

  each([
    './test/images/avatar-64x64.jpg',
    './test/images/test_01.gif',
    './test/images/test_01.jpg',
    './test/images/test_01.png',
    './test/images/test_01.webp',
  ]).test('team create user - avatar %s', async (image: string) => {
    const { cookies } = activeUser;
    const { name, website, serverIp, serverPassword } = generateTeamInfo();

    await req
      .post('/api/teams/create')
      .type('form')
      .set('Cookie', cookies)
      .field('name', name)
      .field('website', website)
      .field('serverIp', serverIp)
      .field('serverPassword', serverPassword)
      .attach('avatar', image)
      .set('Accept', 'application/json')
      .expect(201);

    const { url } = await TeamsApiAxiosParamCreator(apiConfig).teamsControllerGetTeamInfo();
    await req
      .get(url)
      .set('Cookie', cookies)
      .expect(200)
      .expect((result) => {
        const data = result.body as GetTeamResponse;

        expect(data.id).toBeDefined();
        expect(data.name).toBe(name);
        expect(data.website).toBe(website);
        expect(data.server.ip).toBe(serverIp);
        expect(data.server.password).toBe(serverPassword);
        expect(data.avatar).toBeDefined();
      });
  });
});
