export interface ResizeParameters {
  width: number;
  height: number;
}

export enum ImageProcessorJobType {
  Upload,

  Deletion,
}

export interface ImageProcessorJob {
  jobType: ImageProcessorJobType;
}

export interface ImageUploadJob extends ImageProcessorJob {
  /**
   * image source path
   */
  source: string;

  /**
   * resize arguments.
   * The Image is not resized if this property is null.
   */
  resize?: ResizeParameters;
}

/**
 * delete image from /public/ io
 */
export interface ImageDeletionJob extends ImageProcessorJob {
  sourceImage: string;

  targetImage: string;
}
