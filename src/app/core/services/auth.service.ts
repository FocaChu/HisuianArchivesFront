import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { LoginRequestDto, UserSummaryResponseDto, AuthResponseDto, RegisterRequestDto, DecodedTokenDto } from '../../core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  private currentUserProfileSubject = new BehaviorSubject<UserSummaryResponseDto | null>(null);
  public currentUserProfile$ = this.currentUserProfileSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<DecodedTokenDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('auth_token');
    const userProfile = localStorage.getItem('user_profile');

    if (token) {
      try {
        const decodedToken: DecodedTokenDto = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (!isExpired) {
          this.currentUserSubject.next(decodedToken);
          this.isLoggedInSubject.next(true);
          this.currentUserProfileSubject.next(userProfile ? JSON.parse(userProfile) : null);
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequestDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_profile', JSON.stringify(response.userProfile)); 

        this.isLoggedInSubject.next(true);
        this.currentUserProfileSubject.next(response.userProfile);

        this.router.navigate(['/']);
      })
    );
  }

  register(data: RegisterRequestDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }
    private handleAuthSuccess(response: AuthResponseDto): void {
    if (!response || !response.token) return;

    localStorage.setItem('auth_token', response.token);
    if (response.userProfile) {
      localStorage.setItem('user_profile', JSON.stringify(response.userProfile));
      this.currentUserProfileSubject.next(response.userProfile);
    }

    this.isLoggedInSubject.next(true);
    this.router.navigate(['/']);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    
    this.isLoggedInSubject.next(false);
    this.currentUserProfileSubject.next(null);

    this.router.navigate(['/']);
  }

  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  public updateUserProfile(user: UserSummaryResponseDto): void {
    localStorage.setItem('user_profile', JSON.stringify(user));
    this.currentUserProfileSubject.next(user);
  }
}