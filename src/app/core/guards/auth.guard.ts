import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1), 
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        console.warn('User not authenticated. Redirecting to login page.');
        return router.createUrlTree(['/login']);
      }
    })
  );
};