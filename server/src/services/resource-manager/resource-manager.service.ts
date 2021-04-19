import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import AWS from 'aws-sdk';

@Injectable()
export class ResourceManagerService {
  private readonly logger = new Logger(ResourceManagerService.name);
  private readonly s3Client: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new AWS.S3({
      credentials: new AWS.Credentials({
        accessKeyId: this.configService.get<string>('s3.accessKeyId'),
        secretAccessKey: this.configService.get<string>('s3.secretAccessKey'),
      }),

      endpoint: this.configService.get<string>('s3.endpoint'),
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  public async deleteImage(name: string) {
    const bucket = this.configService.get<string>('s3.imageBucket');

    try {
      await this.s3Client
        .deleteObject({
          Bucket: bucket,
          Key: name,
        })
        .promise();
    } catch (error) {
      // swallow error
      this.logger.error(`failed to delete image resource ${name} from bucket ${bucket}. ${error as string}`);
    }
  }
}
