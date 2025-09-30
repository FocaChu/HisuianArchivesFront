import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('fake_auth_token');
  }

  login() {
    console.log('Simulando login...');
    localStorage.setItem('fake_auth_token', 'user-is-logged-in');
    this.loggedIn.next(true);
    this.router.navigate(['/']); 
  }

  logout() {
    console.log('Executando logout...');
    localStorage.removeItem('fake_auth_token');
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }
}