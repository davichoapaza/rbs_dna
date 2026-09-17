import { inject, Injectable } from '@angular/core'; // Cambiado @Service por @Injectable
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
    //const rolId = usuario?.roles?.[0];// || 1;  //'administrador';
    //console.log('el rol que tien es RRRRRRRRRRR  ', usuarioBackend.roles[0].id);
    console.log('usuarioId:', usuario);

    console.log('usuarioId:', usuario?.rol?.[0]);
    console.log('usuarioId:', usuario);
    console.log('x*************************x');

    console.log('el rol que tiene es RRRRRRRRRRROOOOOL ', usuario?.roles?.[0]?.id);

    // Acceso seguro con optional chaining (?.)
    //console.log('el rol que tiene es RRRRRRRRRRR ', usuario.roles?.[0]?.id);

    //const rolId:number = this.usuarioRoles || usuario?.roles?.[0].id;
    const rolId: number = usuario?.roles?.[0]?.id ?? 1;

    if (!usuarioId) {
      //5961253
      console.warn('No hay usuario autenticado para cargar menús');
      this.menuItems = [];
      return;
    }

    this.obtenerMenusUsuarioRol(usuarioId, rolId).subscribe((items: MenuItem[]) => {
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
}
