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

  inicioSession(usuario: string, password: string): boolean {
    if (!this.browser) return false;

    const validUsers: Usuario[] = [
      {
        id: 1,
        nombre: 'David Apaza Canaza',
        email: 'david@rbsdna.com',
        rol: ['administrador', 'director', 'jefe', 'inspector'],
      },
      { id: 2, nombre: 'Maria Gomez', email: 'maria@rbsdna.com', rol: ['jefe'] },
      { id: 3, nombre: 'Juan Perez', email: 'juan@rbsdna.com', rol: ['inspector'] },
      { id: 4, nombre: 'Ana Torres', email: 'ana@rbsdna.com', rol: ['inspector'] },
    ];

    const usuarioEncontrado = validUsers.find(
      (u) => u.nombre.toLowerCase().includes(usuario.toLowerCase()) || u.email === usuario,
    );

    if (usuarioEncontrado && password === '123456') {
      const mockToken = 'mock-jwt-token-' + Date.now();

      sessionStorage.setItem(this.token, mockToken);
      sessionStorage.setItem(this.usuario, JSON.stringify(usuarioEncontrado));

      this.autenticado.set(true);
      this.usuarioActual.set(usuarioEncontrado);
      return true;
    }
    return false;
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

/*import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { AuthResponse, UsuarioBackend } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly apiUrl = 'http://localhost:8080/api/v1/auth/login';

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  // Signals para el manejo reactivo del estado
  autenticado = signal<boolean>(false);
  usuarioActual = signal<UsuarioBackend | null>(null);

  constructor() {
    if (this.isBrowser) {
      const usuarioGuardado = this.obtenerUsuarioStorage();
      const tieneToken = !!this.obtenerToken();

      this.autenticado.set(tieneToken);
      this.usuarioActual.set(usuarioGuardado);
    }
  }

  
  inicioSession(username: string, password: string): Observable<boolean> {
    if (!this.isBrowser) return of(false);

    return this.http.post<AuthResponse>(this.apiUrl, { username, password }).pipe(
      tap((response) => {
        if (response.exito && response.datos) {
          const usuarioData = response.datos;

          // Almacenar en sessionStorage
          sessionStorage.setItem(this.TOKEN_KEY, usuarioData.token);
          sessionStorage.setItem(this.USER_KEY, JSON.stringify(usuarioData));

          // Actualizar Signals
          this.autenticado.set(true);
          this.usuarioActual.set(usuarioData);
        }
      }),
      map((response) => response.exito),
      catchError((error) => {
        console.error('Error de autenticación:', error);
        this.limpiarEstado();
        return of(false);
      }),
    );
  }

  obtenerToken(): string | null {
    if (!this.isBrowser) return null;
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  loggin(): boolean {
    return this.autenticado();
  }

  logout(): void {
    this.limpiarEstado();
    this.router.navigate(['/login']);
  }

  private obtenerUsuarioStorage(): UsuarioBackend | null {
    if (!this.isBrowser) return null;
    const data = sessionStorage.getItem(this.USER_KEY);
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private limpiarEstado(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
    }
    this.autenticado.set(false);
    this.usuarioActual.set(null);
  }
}*/

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
