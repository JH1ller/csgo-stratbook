import { readFileSync } from 'fs';
import Minio from 'minio';
import { Log } from '@/utils/logger';
import { StorageClient } from '@/storage/StorageClient';

export class MinIOClientAdapter implements StorageClient {
  private client: Minio.Client;

  constructor(client: Minio.Client) {
    this.client = client;
  }

  async uploadFile(filepath: string, filename: string) {
    try {
      const fileContent = readFileSync(filepath);
      const data = await this.client.fPutObject(process.env.MINIO_BUCKET_NAME!, filename, filepath, {});
      Log.success('fileUpload::uploadFile', `File uploaded successfully. Key: ${filename}`);
      return { Location: filename }; // MinIO does not return a Location field, so we're returning the filename
    } catch (error) {
      Log.error('fileUpload::uploadFile', error.message);
      throw error;
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      await this.client.removeObject(process.env.MINIO_BUCKET_NAME!, filename);
      Log.success('fileUpload::deleteFile', `File deleted successfully. Key: ${filename}`);
      return;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
