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
  private readonly baseUrl = 'http://localhost:8080/api/v1/seguridad/menus';

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

/*import { inject, Injectable } from '@angular/core'; // Cambiado @Service por @Injectable
import { Auth } from './auth';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
export type UserRole = 'administrador' | 'director' | 'jefe' | 'inspector';

export interface MenuItem {
  path: string;
  icon: string;
  label: string;
  roles?: UserRole[];
}

// Interfaz que devuelve tu backend Spring Boot
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
  usuarioRoles: UserRole[] | undefined;

  private readonly http = inject(HttpClient);
  private auth = inject(Auth);
  private readonly baseUrl = 'http://localhost:8080/api/v1/seguridad/menus';

  menuItems: MenuItem[] = [];

  constructor() {
    this.usuarioRoles = this.auth.usuarioActual()?.rol;
    this.cargarMenuDesdeBackend();
  }

  cargarMenuDesdeBackend(): void {
    const usuario = this.auth.usuarioActual();
    const usuarioId = usuario?.id;
    const rolId: number = usuario?.roles?.[0]?.id ?? 1;

    if (!usuarioId) {
      console.warn('No hay usuario autenticado para cargar menús');
      this.menuItems = [];
      return;
    }

    this.obtenerMenusUsuarioRol(usuarioId, rolId).subscribe((items: MenuItem[]) => {
      console.log('******************************');
      console.log('Menús cargados desde el backend:', items);
      this.menuItems = items;
      console.log(' cargados:', this.menuItems);
    });
  }

  obtenerMenusUsuarioRol(usuarioId: number, rolId: number): Observable<MenuItem[]> {
    const url = `${this.baseUrl}/usuario/${usuarioId}/rol/${rolId}`;
    console.log('los dato que llego son usuarioId:', usuarioId, 'rolId:', rolId);

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
  actualizarMenuPorRol(nuevo_rol: number): void {
    const usuarioId = this.auth.usuarioActual()?.id;

    console.log('Actualizando menú para el rol ID:', nuevo_rol);

    if (!usuarioId) {
      console.warn('No hay un usuario autenticado para actualizar el menú');
      this.menuItems = [];
      return;
    }

    this.obtenerMenusUsuarioRol(usuarioId, nuevo_rol).subscribe((items: MenuItem[]) => {
      this.menuItems = items;
      console.log(`Menús cargados exitosamente para el rol ID ${nuevo_rol}:`, this.menuItems);
    });
  }
}
*/
