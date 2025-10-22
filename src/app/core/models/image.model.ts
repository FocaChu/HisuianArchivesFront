import { ImageType } from '../constants/image-types';

export interface ImageUploadRequestDto {
  file: File;
  imageType: ImageType;
}

export interface ImageUploadResponseDto {
  imageId: string;
  url: string;
}
