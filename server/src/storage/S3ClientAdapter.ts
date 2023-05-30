import { readFileSync } from 'fs';

import { Log } from '@/utils/logger';
import { PutObjectCommand, PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { StorageClient } from '@/storage/StorageClient';

export class S3ClientAdapter implements StorageClient {
  private client: S3;

  constructor(client: S3) {
    this.client = client;
  }

  async uploadFile(filepath: string, filename: string) {
    try {
      const fileContent = readFileSync(filepath);
      const params: PutObjectCommandInput = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: filename, // filename on S3
        Body: fileContent,
      };
      await this.client.send(new PutObjectCommand(params));

      Log.success('fileUpload::uploadFile', `File uploaded successfully. Key: ${filename}`);
      const location = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`; // Construct the file's URL
      return { Location: location };
    } catch (error) {
      Log.error('fileUpload::uploadFile', error.message);
      throw error;
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: filename, // filename on S3
      };

      await this.client.deleteObject(params);

      Log.success('fileUpload::deleteFile', `File deleted successfully. Key: ${filename}`);
      return;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
