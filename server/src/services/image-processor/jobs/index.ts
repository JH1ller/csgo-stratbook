export interface ResizeParameters {
  width: number;
  height: number;
}

export enum ImageProcessorJobType {
  /**
   * upload task
   */
  Upload,

  /**
   * delete task for image files from /public/
   */
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
 * Delete job for uploaded image assets
 *
 * This operation is split from the upload job, as node cannot
 * immediately free file handles. Therefore we run into access problems when
 * attempting to delete these files immediately.
 */
export interface ImageDeletionJob extends ImageProcessorJob {
  /**
   * path to source image
   */
  source: string;

  /**
   * (file)-name of the newly converted and compressed image
   */
  finalFileName?: string;
}
