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
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./modulos/usuarios/usuarios').then((m) => m.Usuarios),
    canActivate: [authGuard],
  },
  {
    path: 'cuestionario-orp',
    loadComponent: () =>
      import('./modulos/cuestionario-orp/cuestionario-orp').then((m) => m.CuestionarioOrp),
    canActivate: [authGuard],
  },
  {
    path: 'verificacion-ncr',
    loadComponent: () =>
      import('./modulos/verificacion-ncr/verificacion-ncr').then((m) => m.VerificacionNcr),
    canActivate: [authGuard],
  },
  {
    path: 'verificacion-sms',
    loadComponent: () =>
      import('./modulos/verificacion-sms/verificacion-sms').then((m) => m.VerificacionSms),
    canActivate: [authGuard],
  },
  {
    path: 'd-direccion-inicio',
    loadComponent: () =>
      import('./modulos/d-direccion-inicio/d-direccion-inicio').then((m) => m.DDireccionInicio),
    canActivate: [authGuard],
  },
  {
    path: 'd-bandeja-revision',
    loadComponent: () =>
      import('./modulos/d-bandeja-revision/d-bandeja-revision').then((m) => m.DBandejaRevision),
    canActivate: [authGuard],
  },
  {
    path: 'j-designar-inspector',
    loadComponent: () =>
      import('./modulos/j-designar-inspector/j-designar-inspector').then(
        (m) => m.JDesignarInspector,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'j-bandeja-revision',
    loadComponent: () =>
      import('./modulos/j-bandeja-revision/j-bandeja-revision').then((m) => m.JBandejaRevision),
    canActivate: [authGuard],
  },
  {
    path: 'j-ejecucion',
    loadComponent: () => import('./modulos/j-ejecucion/j-ejecucion').then((m) => m.JEjecucion),
    canActivate: [authGuard],
  },
  {
    path: 'i-asignaciones',
    loadComponent: () =>
      import('./modulos/i-asignaciones/i-asignaciones').then((m) => m.IAsignaciones),
    canActivate: [authGuard],
  },
  {
    path: 'i-evaluacion',
    loadComponent: () => import('./modulos/i-evaluacion/i-evaluacion').then((m) => m.IEvaluacion),
    canActivate: [authGuard],
  },
  {
    path: 'i-ejeucion',
    loadComponent: () => import('./modulos/i-ejeucion/i-ejeucion').then((m) => m.IEjeucion),
    canActivate: [authGuard],
  },
  {
    path: 'i-ejeucion',
    loadComponent: () => import('./modulos/i-ejeucion/i-ejeucion').then((m) => m.IEjeucion),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/inicio',
  },
];
