import jwtDecode from 'jwt-decode';
import request from 'request';
import url from 'url';
import axios from 'axios';
import { remote } from 'electron';
const dotenv = remote.getGlobal('process').env;
const redirectUri = 'file:///callback';

class AuthService {
  private static instance: AuthService;

  private accessToken: string | null = null;
  private profile = null;
  private refreshToken: string | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getProfile() {
    return this.profile;
  }

  public loadAuthPage() {
    const win = remote.getCurrentWindow();
    win.loadURL(AuthService.getAuthenticationURL());
    // const {
    //   session: { webRequest },
    // } = win?.webContents as Electron.WebContents;

    const webContents = win.webContents;
    const session = webContents.session;
    const webRequest = session.webRequest;

    const filter = {
      urls: ['file:///callback*'],
    };

    webRequest.onBeforeRequest(filter, async ({ url }) => {
      console.log(url);
      await this.loadTokens(url);
      win.loadURL('app://./index.html');
    });
  }

  public static getAuthenticationURL(): string {
    return (
      'https://' +
      dotenv.AUTH0_DOMAIN +
      '/authorize?' +
      'audience=' +
      dotenv.AUTH0_IDENTIFIER +
      '&' +
      'scope=openid profile offline_access&' +
      'response_type=code&' +
      'client_id=' +
      dotenv.AUTH0_CLIENT_ID +
      '&' +
      'redirect_uri=' +
      redirectUri
    );
  }

  /* public refreshTokens(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const refreshToken = await keytar.getPassword(
        keytarService,
        keytarAccount
      );

      if (!refreshToken) return reject();

      const refreshOptions = {
        method: 'POST',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        body: {
          grant_type: 'refresh_token',
          client_id: process.env.AUTH0_CLIENTID,
          refresh_token: refreshToken,
        },
        json: true,
      };

      request(refreshOptions, async (error, response, body) => {
        if (error || body.error) {
          await this.logout();
          return reject(error || body.error);
        }

        this.accessToken = body.access_token;
        this.profile = jwtDecode(body.id_token);

        resolve();
      });
    });
  } */

  public loadTokens(callbackURL: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const urlParts = url.parse(callbackURL, true);
      const query = urlParts.query;

      const exchangeOptions = {
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID,
        code: query.code,
        redirect_uri: redirectUri,
      };

      const options = {
        method: 'POST',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(exchangeOptions),
      };

      request(options, async (error, resp, body) => {
        if (error || body.error) {
          //await this.logout();
          return reject(error || body.error);
        }

        const responseBody = JSON.parse(body);
        console.log(responseBody);
        this.accessToken = responseBody.access_token;
        this.profile = jwtDecode(responseBody.id_token);
        this.refreshToken = responseBody.refresh_token;

        /* keytar.setPassword(
          keytarService,
          keytarAccount,
          this.refreshToken as string
        ); */

        resolve();
      });
    });
  }

  async logout(): Promise<void> {
    try {
      await axios.get(AuthService.getLogOutUrl());
    } catch (error) {
      console.error(error);
    }
    this.accessToken = null;
    this.profile = null;
    this.refreshToken = null;
  }

  public static getLogOutUrl(): string {
    return `https://${dotenv.AUTH0_DOMAIN}/v2/logout`;
  }
}

export default AuthService;
