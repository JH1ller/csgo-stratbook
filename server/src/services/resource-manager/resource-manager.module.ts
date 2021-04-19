import { Module } from '@nestjs/common';

import { ResourceManagerService } from './resource-manager.service';

@Module({
  providers: [ResourceManagerService],
  exports: [ResourceManagerService],
})
export class ResourceManagerModule {}
