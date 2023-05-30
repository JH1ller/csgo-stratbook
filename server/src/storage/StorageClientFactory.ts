import { S3 } from '@aws-sdk/client-s3';
import { StorageClient } from './StorageClient';
import { S3ClientAdapter } from './S3ClientAdapter';
import { MinIOClientAdapter } from './MinIOClientAdapter';
import * as MinIO from 'minio';
import dotenv from 'dotenv';

let cachedStorageClient: StorageClient | null = null;
export const createStorageClient = (): StorageClient => {
  dotenv.config();
  //console.log(process.env);
  if (cachedStorageClient) {
    return cachedStorageClient;
  }
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isMinIO = process.env.STORAGE_TYPE === 'minio';
  const clientOptions = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: 'eu-central-1',
  };
  if (isDevelopment && isMinIO) {
    const minioClient = new MinIO.Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: Number(process.env.MINIO_PORT!),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
      bucket: process.env.MINIO_BUCKET_NAME!,
    });
    cachedStorageClient = new MinIOClientAdapter(minioClient);
  } else {
    const s3 = new S3(clientOptions);
    cachedStorageClient = new S3ClientAdapter(s3);
  }
  return cachedStorageClient;
};
