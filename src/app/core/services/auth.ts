import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export type UserRole = 'administrador' | 'director' | 'jefe' | 'inspector';
/*
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol?: UserRole[];
}
*/

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
  roles?: RolBackend[]; // <--- Agrega esta propiedad
  rol?: UserRole[]; // Propiedad de retrocompatibilidad
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private token = 'auth_token';
  private usuario = 'user_data';
  private browser: boolean;
  private apiUrl = 'http://localhost:8080/api/v1/auth/login';

  autenticado = signal<boolean>(false);
  usuarioActual = signal<Usuario | null>(null);

  /** Emite el resultado de cada intento de login (true/false) */
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

    // Retorna directamente la tubería HTTP sin hacer .subscribe() interno
    return this.http.post<any>(this.apiUrl, { username: usuario, password: password }).pipe(
      tap((response) => {
        if (response && response.exito) {
          const usuarioBackend = response.datos;

          // Mapeo de campos de compatibilidad
          usuarioBackend.nombre = usuarioBackend.nombreCompleto;
          usuarioBackend.rol = usuarioBackend.roles?.map((r: any) => r.codigo.toLowerCase());
          console.log('el rol que tien es RRRRRRRRRRR  ', usuarioBackend);

          sessionStorage.setItem(this.token, usuarioBackend.token);
          sessionStorage.setItem(this.usuario, JSON.stringify(usuarioBackend));
          console.log();

          // Actualizar Signals reactivos
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

  /*inicioSession(usuario: string, password: string): Observable<boolean> {
    if (!this.browser) {
      this.loginResult$.next(false);
      return of(false);
    }

    const obs$ = this.http.post<any>(this.apiUrl, { username: usuario, password: password }).pipe(
      tap((response) => {
        if (response && response.exito) {
          const usuarioBackend = response.datos;

          usuarioBackend.nombre = usuarioBackend.nombreCompleto;
          usuarioBackend.rol = usuarioBackend.roles?.map((r: any) => r.codigo.toLowerCase());

          sessionStorage.setItem(this.token, usuarioBackend.token);
          sessionStorage.setItem(this.usuario, JSON.stringify(usuarioBackend));

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

    console.log(' se dispare');
    // Suscripción interna: garantiza que la petición SIEMPRE se dispare
    obs$.subscribe((ok) => this.loginResult$.next(ok));

    return obs$;
  }*/

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
}

/*import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
export type UserRole = 'administrador' | 'director' | 'jefe' | 'inspector';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol?: UserRole[];
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private token = 'auth_token';
  private usuario = 'user_data';
  private browser: boolean;
  private apiUrl = 'http://localhost:8080/api/v1/auth/login';

  autenticado = signal<boolean>(false);
  usuarioActual = signal<Usuario | null>(null);

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
    console.log('DAVID TOKEN : ', sessionStorage.getItem(this.token));
    console.log('ERRRRRRRREEEEE :', sessionStorage.getItem(this.token));
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
    console.log('usuario : ', usuario);
    console.log('password : ', password);

    if (!this.browser) return of(false);

    console.log('********---- 1. Enviando petición HTTP ----************');

    return this.http.post<any>(this.apiUrl, { username: usuario, password: password }).pipe(
      tap((response) => {
        console.log('********---- 2. Respuesta recibida del Servidor: ----************', response);

        if (response && response.exito) {
          console.log('********---- 3. Autenticación Exitosa ----************');
          const usuarioBackend = response.datos;

          // Mapeo de campos de compatibilidad si es necesario
          usuarioBackend.nombre = usuarioBackend.nombreCompleto;
          usuarioBackend.rol = usuarioBackend.roles?.map((r: any) => r.codigo.toLowerCase());

          sessionStorage.setItem(this.token, usuarioBackend.token);
          sessionStorage.setItem(this.usuario, JSON.stringify(usuarioBackend));

          this.autenticado.set(true);
          this.usuarioActual.set(usuarioBackend);
        } else {
          console.warn(
            '********---- 3. Servidor respondió pero exito == false ----************',
            response?.mensaje,
          );
        }
      }),
      map((response) => !!response?.exito),
      catchError((error) => {
        console.error('********---- ERROR HTTP O CORS EN LA PETICIÓN ----************', error);
        return of(false);
      }),
    );
  }

  loggin(): boolean {
    if (!this.browser) return false;
    return this.tieneToken();
  }
  logout(): void {
    // LIMPIAR sessionStorage
    sessionStorage.removeItem(this.token);
    sessionStorage.removeItem(this.usuario);
    this.autenticado.set(false);
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }
}
*/
/*
esto es con localstorage
import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
export type UserRole = 'administrador' | 'director' | 'jefe' | 'inspector';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol?: UserRole[];
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private token = 'auth_token';
  private usuario = 'user_data';
  private browser: boolean;

  autenticado = signal<boolean>(false);
  usuarioActual = signal<Usuario | null>(null);

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.browser = isPlatformBrowser(this.platformId);

    if (this.browser) {
      this.autenticado.set(this.tieneToken());
      console.log('login auth **:', this.autenticado);
      this.usuarioActual.set(this.obtenerUsuario());
      console.log('usuario actual login:', this.usuarioActual);
    }
  }
  private tieneToken(): boolean {
    if (!this.browser) return false;
    return !!localStorage.getItem(this.token);
  }

  private obtenerUsuario(): Usuario | null {
    if (!this.browser) return null;
    const usuario = localStorage.getItem(this.usuario);
    return usuario ? JSON.parse(usuario) : null;
  }

  obtenerToken(): string | null {
    if (!this.browser) return null;
    return localStorage.getItem(this.token);
  }

  loggin(): boolean {
    if (!this.browser) return false;
    return this.tieneToken();
  }

  

  inicioSession(usuario: string, password: string): boolean {
    if (!this.browser) return false;

    const validUsers: Usuario[] = [
      {
        id: 1,
        nombre: 'David Apaza Canaza',
        email: 'david@rbsdna.com',
        rol: ['administrador', 'director', 'inspector', 'jefe'],
      },
      {
        id: 2,
        nombre: 'Maria Gomez',
        email: 'maria@rbsdna.com',
        rol: ['jefe'],
      },
      {
        id: 3,
        nombre: 'Juan Perez',
        email: 'juan@rbsdna.com',
        rol: ['inspector'],
      },
      {
        id: 4,
        nombre: 'Ana Torres',
        email: 'ana@rbsdna.com',
        rol: ['inspector'],
      },
    ];

    // Buscar usuario
    const usuarioEncontrado = validUsers.find(
      (u) => u.nombre.toLowerCase().includes(usuario.toLowerCase()) || u.email === usuario,
    );

    if (usuarioEncontrado && password === '123456') {
      const mockToken = 'mock-jwt-token-' + Date.now();

      localStorage.setItem(this.token, mockToken);
      localStorage.setItem(this.usuario, JSON.stringify(usuarioEncontrado));

      this.autenticado.set(true);
      this.usuarioActual.set(usuarioEncontrado);
      console.log('Usuario autenticado:', usuarioEncontrado);
      console.log('usuarioActual signal:', this.usuarioActual());
      return true;
    }
    return false;
  }

  logout(): void {
    console.log('**************************************');
    console.log('DAVID APAZA');
    console.log('**********CIERRE DE SESSION***********');

    localStorage.removeItem(this.token);
    localStorage.removeItem(this.usuario);
    this.autenticado.set(false);
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }
}


*/
