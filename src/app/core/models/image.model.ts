export interface ImageUploadRequestDto {
  file: File;
  imageType: string;
}

export interface ImageUploadResponseDto {
  imageId: string;
  url: string;
}
