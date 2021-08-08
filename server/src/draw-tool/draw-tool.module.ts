import { Module } from '@nestjs/common';

import { DrawToolGateway } from './draw-tool.gateway';

@Module({
  providers: [DrawToolGateway],
  exports: [DrawToolGateway],
})
export class DrawToolModule {}
