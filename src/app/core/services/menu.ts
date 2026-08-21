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
  usuario: UserRole | undefined;

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
      roles: ['director'],
    },
    {
      path: '/cuestionario-orp',
      icon: 'question_answer',
      label: 'Cuestionario ORP',
      roles: ['administrador', 'jefe', 'inspector'],
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
    this.usuario = this.auth.usuarioActual()?.rol;
    this.menuItems = this.menuFiltradoPorRol1(this.usuario);
  }

  menuFiltradoPorRol1(usuarioRol?: UserRole): MenuItem[] {
    console.log('Rol recibido para filtrar el menú:', usuarioRol);

    /*    if (!usuarioRol) {
      return [];
    }*/

    return this.allMenuItems.filter((item) => item.roles?.includes(usuarioRol!));
  }
  /*{
      path: '/inicio',
      icon: 'home',
      label: 'Inicio',
      roles: ['administrador', 'jefe', 'inspector'],
    },
*/
}
