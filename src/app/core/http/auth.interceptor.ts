import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  let headers = req.headers;

  // Always add header to skip ngrok browser warning
  headers = headers.set('ngrok-skip-browser-warning', '1');

  if (authToken) {
    headers = headers.set('Authorization', `Bearer ${authToken}`);
  }

  const authReq = req.clone({ headers });

  return next(authReq);
};