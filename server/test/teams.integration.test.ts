import path from 'path';

import { req, apiConfig } from './config';
import { createLoginAccount, TestUser, generateTeamInfo } from './utils';

import { UsersApiAxiosParamCreator, TeamsApiAxiosParamCreator, GetTeamResponse } from './api';

jest.setTimeout(15000);

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

  test.concurrent.each([
    './images/avatar-64x64.jpg',
    './images/test_01.gif',
    './images/test_01.jpg',
    './images/test_01.png',
    './images/test_01.webp',
  ])('team create user - avatar %s', async (image: string) => {
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
      .attach('avatar', path.join(__dirname, image))
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
        expect(data.joinCode).toBeDefined();
      });
  });

  it('team get team info - no team', async () => {
    const { url } = await TeamsApiAxiosParamCreator(apiConfig).teamsControllerGetTeamInfo();

    return req.get(url).set('Cookie', activeUser.cookies).set('Accept', 'application/json').expect(400);
  });

  test.concurrent.each([1, 4, 8, 16])('team - user joins team', async (userCount: number) => {
    const { name, website, serverIp, serverPassword } = generateTeamInfo();

    await req
      .post('/api/teams/create')
      .type('form')
      .set('Cookie', activeUser.cookies)
      .send({ name, website, serverIp, serverPassword })
      .set('Accept', 'application/json')
      .expect(201);

    const getTeamInfo = await TeamsApiAxiosParamCreator(apiConfig).teamsControllerGetTeamInfo();
    const { body } = await req //
      .get(getTeamInfo.url)
      .set('Cookie', activeUser.cookies)
      .expect(200)
      .expect((result) => {
        expect(result.body.joinCode).toBeDefined();
      });

    const joinCode = body.joinCode as string;

    for (let i = 0; i < userCount; i++) {
      const joinUser = await createLoginAccount();

      const joinTeamArgs = {
        joinCode,
      };

      const joinTeam = await TeamsApiAxiosParamCreator(apiConfig).teamsControllerJoinTeam(joinTeamArgs);
      await req //
        .patch(joinTeam.url)
        .set('Cookie', joinUser.cookies)
        .send(joinTeamArgs)
        .expect(200);

      await req //
        .get(getTeamInfo.url)
        .set('Cookie', joinUser.cookies)
        .expect(200);
    }
  });

  it('team - join too many users', async () => {
    const { name, website, serverIp, serverPassword } = generateTeamInfo();

    await req
      .post('/api/teams/create')
      .type('form')
      .set('Cookie', activeUser.cookies)
      .send({ name, website, serverIp, serverPassword })
      .set('Accept', 'application/json')
      .expect(201);

    const getTeamInfo = await TeamsApiAxiosParamCreator(apiConfig).teamsControllerGetTeamInfo();
    const { body } = await req //
      .get(getTeamInfo.url)
      .set('Cookie', activeUser.cookies)
      .expect(200)
      .expect((result) => {
        expect(result.body.joinCode).toBeDefined();
      });

    const joinCode = body.joinCode as string;

    for (let i = 0; i < 16; i++) {
      const joinUser = await createLoginAccount();

      const joinTeamArgs = {
        joinCode,
      };

      const joinTeam = await TeamsApiAxiosParamCreator(apiConfig).teamsControllerJoinTeam(joinTeamArgs);
      await req //
        .patch(joinTeam.url)
        .set('Cookie', joinUser.cookies)
        .send(joinTeamArgs)
        .expect(200);

      await req //
        .get(getTeamInfo.url)
        .set('Cookie', joinUser.cookies)
        .expect(200);
    }

    const joinUser = await createLoginAccount();

    const joinTeamArgs = {
      joinCode,
    };

    const joinTeam = await TeamsApiAxiosParamCreator(apiConfig).teamsControllerJoinTeam(joinTeamArgs);
    await req //
      .patch(joinTeam.url)
      .set('Cookie', joinUser.cookies)
      .send(joinTeamArgs)
      .expect(400);
  });

  // it('user delete - joined team', async () => {
  //   const { name, website, serverIp, serverPassword } = generateTeamInfo();

  //   await req
  //     .post('/api/teams/create')
  //     .type('form')
  //     .set('Cookie', activeUser.cookies)
  //     .send({ name, website, serverIp, serverPassword })
  //     .set('Accept', 'application/json')
  //     .expect(201);

  //   const { url } = await UsersApiAxiosParamCreator(apiConfig).usersControllerGetUser();

  //   const { body } = await req //
  //     .get(url)
  //     .set('Cookie', activeUser.cookies)
  //     .set('Accept', 'application/json')
  //     .expect(200);
  // });
});
