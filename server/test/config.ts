import request from 'supertest';
import dotenv from 'dotenv';

import { Configuration } from './api';

dotenv.config();

export const req = request(`http://localhost:${process.env.PORT}`);
export const configuration = new Configuration({
  basePath: `http://localhost:${process.env.PORT}`,
});
