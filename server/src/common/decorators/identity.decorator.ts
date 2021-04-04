import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Identity = createParamDecorator((_data, req: Request) => {
  return req.user;
});
