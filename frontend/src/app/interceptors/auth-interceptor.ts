import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();

  // Si pas de token, on laisse passer la requête telle quelle
  // (login et register n'ont pas besoin de token)
  if (!token) {
    return next(req);
  }

  // Clone la requête et ajoute le header Authorization
  // On clone car les requêtes HTTP sont immutables dans Angular
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};