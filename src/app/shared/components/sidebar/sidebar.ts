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

  abrirModalCambiarRol() {
    const usuario_actual = this.auth.usuarioActual();
    //roles_disponibles: UserRole[] = this.auth.usuarioActual()?.rol;

    // Selección del rol individual activo
    const rol_actual: UserRole = this.usuarioRol || usuario_actual?.rol?.[0] || 'director';

    const dialogRef = this.dialog.open(CambiarRolDialogo, {
      width: '350px',
      data: {
        rolesDisponibles: this.auth.usuarioActual()?.rol, // Pasa el arreglo con las opciones seleccionables
        rolActual: rol_actual,
      },
    });

    // Se ejecuta cuando el modal se cierra al presionar "Aplicar Cambio"
    dialogRef.afterClosed().subscribe((nuevo_rol: UserRole | undefined) => {
      if (nuevo_rol) {
        // 1. Actualizar la variable del estado local
        this.usuarioRol = nuevo_rol;

        // 2. Obtener el nuevo filtro y forzar una nueva referencia del arreglo
        const menu_actualizado = this.menu.menuFiltradoPorRol1(nuevo_rol);

        // 3. Sincronizar tanto el servicio como el componente
        this.menu.menuItems = menu_actualizado;
        this.menuItems = [...menu_actualizado];
      }
    });
  }
}
