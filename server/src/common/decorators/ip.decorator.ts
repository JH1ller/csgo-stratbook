import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

/**
 * returns the ip address of the current request
 */
export const Ip = createParamDecorator((_data, req: Request) => {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
});
