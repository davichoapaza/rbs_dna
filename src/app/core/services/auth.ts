import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export type UserRole = 'admin' | 'director' | 'jefe' | 'inspector';

export interface RolBackend {
  id: number;
  codigo: string;
}

export interface Usuario {
  id: number;
  username?: string;
  nombreCompleto?: string;
  nombre?: string;
  email?: string;
  roles?: RolBackend[];
  rol?: UserRole[];
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private token = 'authtoken';
  private usuario = 'user';
  private browser: boolean;
  private apiUrl = 'http://localhost:8080/api/v1/auth/login';

  autenticado = signal<boolean>(false);
  usuarioActual = signal<Usuario | null>(null);

  private loginResult$ = new Subject<boolean>();
  loginResult = this.loginResult$.asObservable();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
  ) {
    this.browser = isPlatformBrowser(this.platformId);

    if (this.browser) {
      this.autenticado.set(this.tieneToken());
      this.usuarioActual.set(this.obtenerUsuario());
    }
  }

  obtenerToken(): string | null {
    if (!this.browser) return null;
    return sessionStorage.getItem(this.token);
  }

  private tieneToken(): boolean {
    if (!this.browser) return false;
    return !!sessionStorage.getItem(this.token);
  }

  private obtenerUsuario(): Usuario | null {
    if (!this.browser) return null;
    const usuario = sessionStorage.getItem(this.usuario);
    return usuario ? JSON.parse(usuario) : null;
  }
  inicioSession(usuario: string, password: string): Observable<boolean> {
    if (!this.browser) return of(false);
    console.log('Disparando petición HTTP de inicio de sesión...');
    return this.http.post<any>(this.apiUrl, { username: usuario, password: password }).pipe(
      tap((response) => {
        if (response && response.exito) {
          const usuarioBackend = response.datos;
          usuarioBackend.nombre = usuarioBackend.nombreCompleto;
          usuarioBackend.rol = usuarioBackend.roles?.map((r: any) => r.codigo.toLowerCase());
          sessionStorage.setItem(this.token, usuarioBackend.token);
          sessionStorage.setItem(this.usuario, JSON.stringify(usuarioBackend));
          console.log();
          this.autenticado.set(true);
          this.usuarioActual.set(usuarioBackend);
        } else {
          console.warn('Servidor respondió pero exito == false', response?.mensaje);
        }
      }),
      map((response) => !!response?.exito),
      catchError((error) => {
        console.error('ERROR HTTP O CORS EN LA PETICIÓN', error);
        return of(false);
      }),
    );
  }
  loggin(): boolean {
    if (!this.browser) return false;
    return this.tieneToken();
  }

  logout(): void {
    sessionStorage.removeItem(this.token);
    sessionStorage.removeItem(this.usuario);
    this.autenticado.set(false);
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }

  cambiarPassword(payload: { passwordActual: string; passwordNueva: string }): Observable<any> {
    const url = 'http://localhost:8080/api/v1/auth/cambiar-password';
    return this.http.put<any>(url, payload).pipe(
      tap((response) => {
        if (response && response.exito) {
          console.log('Contraseña cambiada con éxito');
        } else {
          console.warn('Error al cambiar la contraseña', response?.mensaje);
        }
      }),
      catchError((error) => {
        console.error('Error HTTP al cambiar la contraseña', error);
        return of({ exito: false, mensaje: 'Error al cambiar la contraseña' });
      }),
    );
  }
}
