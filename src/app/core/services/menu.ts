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
      roles: ['inspector'],
    },
    {
      path: '/cuestionario-orp',
      icon: 'question_answer',
      label: 'Cuestionario ORP',
      roles: ['inspector'],
    },
    {
      path: '/verificacion-ncr',
      icon: 'list_alt',
      label: 'Lista Verificación NCR',
      roles: ['director'],
    },
    {
      path: '/verificacion-sms',
      icon: 'security',
      label: 'Lista Verificación SMS',
      roles: ['director'],
    },
    {
      path: '/configuracion',
      icon: 'settings',
      label: 'Configuración',
      roles: ['inspector'],
    },
  ];

  menuItems: MenuItem[] = [];

  constructor() {
    this.usuarioRoles = this.auth.usuarioActual()?.rol;
    console.log('Menu UsuarioRol :', this.usuarioRoles);
    this.menuItems = this.menuFiltradoPorRol1(this.usuarioRoles);
  }

  menuFiltradoPorRol1(usuario_roles?: UserRole[]): MenuItem[] {
    console.log('Roles recibidos para filtrar el menú:', usuario_roles);

    if (!usuario_roles || usuario_roles.length === 0) {
      return [];
    }

    // Muestra el ítem si al menos uno de los roles del usuario coincide con los del menú
    return this.allMenuItems.filter((item) =>
      item.roles?.some((rol) => usuario_roles.includes(rol)),
    );
  }
}
