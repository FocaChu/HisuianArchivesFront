export interface UserUpdateProfileRequestDto {
  name: string;
  bio?: string;
}

export interface UpdateProfileImageRequestDto {
  imageId: string;
}
