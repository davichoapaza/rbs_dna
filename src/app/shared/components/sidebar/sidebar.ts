import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core'; // 1. Importa ChangeDetectorRef
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { Auth, UserRole } from '../../../core/services/auth';
import { Menu, MenuItem } from '../../../core/services/menu';
import { CambiarRolDialogo } from '../cambiar-rol-dialogo/cambiar-rol-dialogo';

@Component({
  selector: 'app-sidebar',
  standalone: true,
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
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  get menuItems(): MenuItem[] {
    return this.menu.menuItems;
  }

  logout() {
    this.auth.logout();
  }

  abrirModalCambiarRol() {
    const usuario_actual = this.auth.usuarioActual();
    const rol_actual: UserRole = this.usuarioRol || usuario_actual?.rol?.[0] || 'director';

    const dialogRef = this.dialog.open(CambiarRolDialogo, {
      width: '350px',
      data: {
        rolesDisponibles: this.auth.usuarioActual()?.rol,
        rolActual: rol_actual,
      },
    });

    dialogRef.afterClosed().subscribe((nuevo_rol: UserRole | undefined) => {
      if (nuevo_rol) {
        this.ngZone.run(() => {
          this.usuarioRol = nuevo_rol;
          this.menu.actualizarMenuPorRol(nuevo_rol);
          // Forzar el refresco del DOM
          this.cdr.detectChanges();
          this.router.navigate(['/inicio']);
        });
      }
    });
  }
}
