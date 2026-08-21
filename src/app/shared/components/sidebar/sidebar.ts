import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Auth, UserRole } from '../../../core/services/auth';
import { Menu } from '../../../core/services/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CambiarRolDialogo } from '../cambiar-rol-dialogo/cambiar-rol-dialogo';
export interface MenuItem {
  path: string;
  icon: string;
  label: string;
  roles?: UserRole[]; // Roles que pueden ver este item
}

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  paginaActual: string = 'Inicio';
  usuario: any = null;
  usuarioRol: UserRole | null = null;
  private dialog = inject(MatDialog);
  private auth = inject(Auth);
  private router = inject(Router);
  private menu = inject(Menu);
  menuItems: MenuItem[] = [];

  constructor() {
    this.menuItems = this.menu.menuItems;

    console.log('Usuario actual:', this.usuario);
    console.log('averias filtradas por rol:', this.menuItems);
  }

  logout() {
    this.auth.logout();
  }

  /*abrirModalCambiarRol() {
    const usuarioActual = this.auth.usuarioActual();
    const rolesDisponibles: UserRole[] = ['administrador', 'director', 'jefe', 'inspector'];
    //const rolActual: UserRole = usuarioActual?.rol || 'director';
    // Si usuarioActual.rol devuelve un arreglo (UserRole[]):
const rol_actual: UserRole = usuarioActual?.rol?.[0] || 'director';
    const dialogRef = this.dialog.open(CambiarRolDialogo, {
      width: '350px',
      data: {
        rolesDisponibles,
        rolActual,
      },
    });
  }*/
  abrirModalCambiarRol() {
    const usuario_actual = this.auth.usuarioActual();

    const roles_disponibles: UserRole[] = ['administrador', 'director', 'jefe', 'inspector'];

    // Selección del rol individual
    const rol_actual: UserRole = usuario_actual?.rol?.[0] || 'director';

    const dialogRef = this.dialog.open(CambiarRolDialogo, {
      width: '350px',
      data: {
        rolesDisponibles: roles_disponibles, // Asigna la variable en snake_case
        rolActual: rol_actual, // Asigna rol_actual a la propiedad rolActual
      },
    });
  }
}
