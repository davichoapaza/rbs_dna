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

  /*  funciones de autenticación */

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
