import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { Auth } from './auth';

export type UserRole = 'administrador' | 'director' | 'jefe' | 'inspector';

export interface MenuItem {
  path: string;
  icon: string;
  label: string;
  roles?: UserRole[];
}

export interface MenuBackend {
  menuId: number;
  ruta: string;
  icon: string;
  etiqueta: string;
  orden: number;
  menuActivo: string;
}

export interface MenuResponse {
  exito: boolean;
  mensaje: string;
  datos: MenuBackend[];
}

@Injectable({
  providedIn: 'root',
})
export class Menu {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly baseUrl = 'http://192.168.25.17:8080/api/v1/seguridad/menus';

  // 1. Declarar menuItems como WritableSignal
  menuItems = signal<MenuItem[]>([]);

  constructor() {
    // 2. Escuchar reactivamente los cambios de usuario cuando hace login o inicia sesión
    toObservable(this.auth.usuarioActual)
      .pipe(
        switchMap((usuario) => {
          if (!usuario || !usuario.id) {
            return of([]);
          }
          const rolId: number = usuario.roles?.[0]?.id ?? 1;
          return this.obtenerMenusUsuarioRol(usuario.id, rolId);
        }),
      )
      .subscribe((items: MenuItem[]) => {
        console.log('Menús asignados al Signal:', items);
        this.menuItems.set(items); // Notifica el cambio automáticamente a la UI
      });
  }

  obtenerMenusUsuarioRol(usuarioId: number, rolId: number): Observable<MenuItem[]> {
    const url = `${this.baseUrl}/usuario/${usuarioId}/rol/${rolId}`;
    return this.http.get<MenuResponse>(url).pipe(
      map((response) => {
        if (response && response.exito && Array.isArray(response.datos)) {
          return response.datos.map((item) => ({
            path: item.ruta,
            icon: item.icon,
            label: item.etiqueta,
          }));
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error al obtener los menús del backend:', error);
        return of([]);
      }),
    );
  }

  /**
   * Forzar actualización de menú al cambiar de rol en el modal
   */
  actualizarMenuPorRol(nuevo_rol: number): void {
    const usuarioId = this.auth.usuarioActual()?.id;
    if (!usuarioId) return;

    this.obtenerMenusUsuarioRol(usuarioId, nuevo_rol).subscribe((items: MenuItem[]) => {
      this.menuItems.set(items);
    });
  }
}
