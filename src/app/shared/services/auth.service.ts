import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; 
import { environment } from '../../../environments/environment';
import { LoginRequestDto, AuthResponseDto, RegisterRequestDto, DecodedTokenDto } from '../../core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  
  private currentUserSubject = new BehaviorSubject<DecodedTokenDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decodedToken: DecodedTokenDto = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();
        
        if (!isExpired) {
          this.currentUserSubject.next(decodedToken);
          this.isLoggedInSubject.next(true);
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
        const decodedToken: DecodedTokenDto = jwtDecode(response.token);
        this.currentUserSubject.next(decodedToken);
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/']);
      })
    );
  }

  register(data: RegisterRequestDto): Observable<any> { 
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/']);
  }

  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}