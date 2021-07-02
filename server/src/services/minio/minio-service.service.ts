import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);

  private readonly client: Minio.Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Minio.Client({
      accessKey: this.configService.get<string>('minio.accessKeyId'),
      secretKey: this.configService.get<string>('minio.secretAccessKey'),

      endPoint: this.configService.get<string>('minio.endpoint'),
      port: this.configService.get<number>('minio.port'),
      useSSL: this.configService.get<boolean>('minio.useSSL'),
    });
  }

  public async validateBuckets() {
    const imageBucket = this.configService.get<string>('minio.imageBucket');

    const result = await this.client.bucketExists(imageBucket);
    if (!result) {
      this.logger.warn(`Minio bucket ${imageBucket} does not exist! creating...`);

      // prevent auto setup in standalone mode to prevent accidental creation on AWS
      if (process.env.STANDALONE_BUILD) {
        throw new Error('setup minio buckets first!');
      }

      await this.client.makeBucket(imageBucket, 'us-east-1');
    }
  }

  public async deleteImage(name: string) {
    const imageBucket = this.configService.get<string>('minio.imageBucket');

    try {
      await this.client.removeObject(imageBucket, name);
    } catch (error) {
      // swallow error
      this.logger.error(`failed to delete image resource ${name} from bucket ${imageBucket}. ${error as string}`);
    }
  }
}
