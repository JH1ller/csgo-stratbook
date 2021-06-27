import request from 'supertest';
import dotenv from 'dotenv';

import axios from 'axios';
import FormData from 'form-data';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough from 'tough-cookie';

import { Configuration } from './api';

dotenv.config();

export const basePath = `http://localhost:${process.env.PORT}`;

export const req = request(basePath);

export const apiConfig = new Configuration({
  basePath,
  formDataCtor: FormData,
});

export function createAxiosCookieInstance() {
  const instance = axios.create({
    baseURL: basePath,
    withCredentials: true,
  });

  axiosCookieJarSupport(instance);
  instance.defaults.jar = new tough.CookieJar();

  return instance;
}
