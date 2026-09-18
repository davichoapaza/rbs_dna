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
import { MiCuenta } from '../mi-cuenta/mi-cuenta';

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
  usuarioActual = this.auth.usuarioActual;
  /*get menuItems(): MenuItem[] {
    return this.menu.menuItems;
  }*/
  get menuItems(): MenuItem[] {
    return this.menu.menuItems(); // <-- DEBE LLEVAR PARÉNTESIS ()
  }

  logout() {
    this.auth.logout();
  }
  constructor() {
    //this.menuItems; // Inicializa los elementos del menú
    this.usuarioRol = this.auth.usuarioActual()?.rol?.[0] || 'director';
  }

  obtenerColor(): string {
    const colors: Record<UserRole, string> = {
      administrador: '#eb8e8e',
      director: '#4ecdc4',
      jefe: '#ffd93d',
      inspector: '#90eaa5',
    };
    return this.usuarioRol ? colors[this.usuarioRol] : '#ecedee';
  }

  abrirModalCambiarPassword() {
    const dialogRef = this.dialog.open(MiCuenta, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        console.log('Contraseña cambiada con éxito');
      } else {
        console.log('Cambio de contraseña cancelado');
      }
    });
  }

  abrirModalCambiarRol() {
    const usuario_actual = this.auth.usuarioActual();
    // Usa el rol seleccionado localmente (this.usuarioRol) o el primero por defecto
    const rol_actual_codigo = this.usuarioRol?.toUpperCase() || usuario_actual?.roles?.[0]?.codigo;

    const dialogRef = this.dialog.open(CambiarRolDialogo, {
      width: '350px',
      disableClose: true,
      data: {
        rolesDisponibles: usuario_actual?.roles?.map((r) => r.codigo) || [],
        rolActual: rol_actual_codigo,
      },
    });

    dialogRef.afterClosed().subscribe((nuevo_rol: string | undefined) => {
      if (nuevo_rol) {
        this.ngZone.run(() => {
          // 1. Busca el objeto del rol correspondiente para obtener su ID numérico
          const rolEncontrado = usuario_actual?.roles?.find(
            (r) => r.codigo.toUpperCase() === nuevo_rol.toUpperCase(),
          );

          const nuevoRolId = rolEncontrado?.id ?? 1;

          // 2. Actualiza la variable local de estado para que persista el nuevo rol activo
          this.usuarioRol = nuevo_rol.toLowerCase() as UserRole;

          // 3. Ejecuta la actualización dinámica del menú en el servicio
          this.menu.actualizarMenuPorRol(nuevoRolId);

          this.cdr.detectChanges();
          this.router.navigate(['/inicio']);
        });
      }
    });
  }
}
