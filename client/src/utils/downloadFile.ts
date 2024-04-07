import { downloadURI } from './downloadUri';

export const downloadFile = async (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  downloadURI(url, fileName);
};
