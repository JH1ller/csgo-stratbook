export interface ResizeParameters {
  width: number;
  height: number;
}

export interface ImageUploadJob {
  /**
   * image source path
   */
  source: string;

  resize?: ResizeParameters;
}
