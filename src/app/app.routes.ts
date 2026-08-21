import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./modulos/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./modulos/inicio/inicio').then((m) => m.Inicio),
    canActivate: [authGuard],
    data: { roles: ['administrador', 'usuario', 'editor', 'invitado'] }, // ✅ Todos
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./modulos/usuarios/usuarios').then((m) => m.Usuarios),
    canActivate: [authGuard],
    data: { roles: ['administrador'] },
  },
  {
    path: 'cuestionario-orp',
    loadComponent: () =>
      import('./modulos/cuestionario-orp/cuestionario-orp').then((m) => m.CuestionarioOrp),
    canActivate: [authGuard],
    data: { roles: ['administrador', 'usuario', 'editor'] },
  },
  {
    path: 'verificacion-ncr',
    loadComponent: () =>
      import('./modulos/verificacion-ncr/verificacion-ncr').then((m) => m.VerificacionNcr),
    canActivate: [authGuard],
    data: { roles: ['administrador', 'editor'] },
  },
  {
    path: 'verificacion-sms',
    loadComponent: () =>
      import('./modulos/verificacion-sms/verificacion-sms').then((m) => m.VerificacionSms),
    canActivate: [authGuard],
    data: { roles: ['administrador', 'editor'] },
  },
  {
    path: '**',
    redirectTo: '/inicio',
  },
];
