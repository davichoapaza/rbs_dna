import { inject, Injectable } from '@angular/core'; // Cambiado @Service por @Injectable
import { Auth } from './auth';

export type UserRole = 'administrador' | 'director' | 'jefe' | 'inspector';

export interface MenuItem {
  path: string;
  icon: string;
  label: string;
  roles?: UserRole[];
}

@Injectable({
  providedIn: 'root',
})
export class Menu {
  usuarioRoles: UserRole[] | undefined;

  private auth = inject(Auth);
  private allMenuItems: MenuItem[] = [
    {
      path: '/inicio',
      icon: 'home',
      label: 'Inicio',
      roles: ['administrador', 'director', 'jefe', 'inspector'],
    },
    {
      path: '/usuarios',
      icon: 'people',
      label: 'Gestión de Usuarios',
      roles: ['administrador'],
    },
    {
      path: '/cuestionario-orp',
      icon: 'question_answer',
      label: 'Cuestionario ORP',
      roles: ['administrador'],
    },
    {
      path: '/verificacion-ncr',
      icon: 'list_alt',
      label: 'Lista Verificación NCR',
      roles: ['administrador'],
    },
    {
      path: '/verificacion-sms',
      icon: 'security',
      label: 'Lista Verificación SMS',
      roles: ['administrador'],
    },
    {
      path: '/d-direccion-inicio',
      icon: 'dashboard',
      label: 'Dirección DNA',
      roles: ['director'],
    },
    {
      path: '/d-bandeja-revision',
      icon: 'rate_review',
      label: 'Bandeja de Revisión',
      roles: ['director'],
    },
    {
      path: '/j-designar-inspector',
      icon: 'rate_review',
      label: 'Designar Inpector',
      roles: ['jefe'],
    },
    {
      path: '/j-bandeja-revision',
      icon: 'rate_review',
      label: 'Bandeja de Revisión',
      roles: ['jefe'],
    },
    { path: '/j-ejecucion', icon: 'rate_review', label: 'Ejecución', roles: ['jefe'] },
    { path: '/i-asignaciones', icon: 'rate_review', label: 'Asignaciones', roles: ['inspector'] },
    { path: '/i-evaluacion', icon: 'rate_review', label: 'Evaluación', roles: ['inspector'] },
    { path: '/i-ejeucion', icon: 'rate_review', label: 'Ejecución', roles: ['inspector'] },
  ];

  menuItems: MenuItem[] = [];

  constructor() {
    this.usuarioRoles = this.auth.usuarioActual()?.rol;
    console.log('Menu UsuarioRol :', this.usuarioRoles);
    this.menuItems = this.menuFiltradoPorRol1(this.usuarioRoles?.[0]);
  }

  menuFiltradoPorRol1(usuario_rol?: UserRole): MenuItem[] {
    console.log('menuFiltradoProRol1 David PAZA :', usuario_rol);

    if (!usuario_rol) {
      return [];
    }

    return this.allMenuItems.filter((item) => item.roles?.includes(usuario_rol));
  }

  actualizarMenuPorRol(nuevo_rol: UserRole): void {
    this.menuItems = this.menuFiltradoPorRol1(nuevo_rol);
  }
}
