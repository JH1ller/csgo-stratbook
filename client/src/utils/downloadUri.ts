export const downloadURI = (uri: string, fileName: string) => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
