export interface ResizeParameters {
  width: number;
  height: number;
}

export interface ImageUploadJob {
  /**
   * image source path
   */
  source: string;

  /**
   * resize arguments. Image is note resized if this property
   * is null.
   */
  resize?: ResizeParameters;
}
