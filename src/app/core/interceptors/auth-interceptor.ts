import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth'; // Tu servicio de autenticación

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.obtenerToken();
  console.log('DAVID TOKEN INTERCEPTOR : ', token);
  if (token) {
    // agrega la cabecera de autorización (ya que los req son inmutables)
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('****************** ADOLF TOKEN*******************:', clonedReq);
    return next(clonedReq);
  }

  return next(req);
};
