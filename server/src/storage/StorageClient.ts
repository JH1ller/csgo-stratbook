export interface StorageClient {
  uploadFile: (filepath: string, filename: string) => Promise<any>;
  deleteFile: (filename: string) => Promise<void>;
}
