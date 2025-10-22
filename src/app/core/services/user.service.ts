import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserSummaryResponseDto } from '../models/auth.model';
import { UserUpdateProfileRequestDto, UpdateProfileImageRequestDto } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getUserProfile(): Observable<UserSummaryResponseDto> {
    return this.http.get<UserSummaryResponseDto>(`${this.apiUrl}/me`);
  }

  updateProfile(data: UserUpdateProfileRequestDto): Observable<UserSummaryResponseDto> {
    return this.http.put<UserSummaryResponseDto>(`${this.apiUrl}/profile`, data).pipe(
      tap(updatedProfile => {
        this.authService.updateUserProfile(updatedProfile);
      })
    );
  }

  updateProfileImage(data: UpdateProfileImageRequestDto): Observable<UserSummaryResponseDto> {
    return this.http.put<UserSummaryResponseDto>(`${this.apiUrl}/me/profile-image`, data).pipe(
      tap(updatedProfile => {
        this.authService.updateUserProfile(updatedProfile);
      })
    );
  }
}
