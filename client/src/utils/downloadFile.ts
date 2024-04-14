import { downloadURI } from './downloadUri';

export const downloadFile = async (blob: Blob, fileName: string, fileType: [string, string]) => {
  if ('showSaveFilePicker' in window) {
    const newHandle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: `${fileType[1].toUpperCase()} File`,
          accept: {
            [fileType[0]]: [fileType[1]],
          },
        },
      ],
    });
    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    // write our file
    await writableStream.write(blob);

    // close the file and write the contents to disk.
    await writableStream.close();
  } else {
    const url = URL.createObjectURL(blob);
    downloadURI(url, fileName);
  }
};
