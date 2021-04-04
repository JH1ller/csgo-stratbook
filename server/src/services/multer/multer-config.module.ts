import { Module } from '@nestjs/common';

import { MulterConfigService } from './multer-config.service';

@Module({
  providers: [MulterConfigService],
  exports: [MulterConfigService],
})
export class MulterConfigModule {}
