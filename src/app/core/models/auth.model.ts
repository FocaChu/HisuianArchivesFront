export interface RegisterRequestDto {
  name: string;
  bio: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  userProfile: UserSummaryResponseDto;
}

export interface UserSummaryResponseDto {
  userId: string;
  name: string;
  bio: string;
  email: string;
  profileImageId: string;
}

export interface DecodedTokenDto {
  nameId: string;
  email: string;
  role: string | string[]; 
  exp: number; 
}