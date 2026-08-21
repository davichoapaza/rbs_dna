import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
export type UserRole = 'administrador' | 'director' | 'jefe' | 'inspector';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: UserRole;
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

  // Estado reactivo del usuario
  /*usuarioActual = signal<{ rol: UserRole; roles: UserRole[]; nombre: string } | null>({
    rol: 'inspector',
    roles: ['administrador', 'director', 'jefe', 'inspector'],
    nombre: 'DAVID APAZA CANAZA'
  });*/

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
  private tieneToken(): boolean {
    if (!this.browser) return false;
    return !!localStorage.getItem(this.token);
  }

  private obtenerUsuario(): Usuario | null {
    if (!this.browser) return null;
    const usuario = localStorage.getItem(this.usuario);
    return usuario ? JSON.parse(usuario) : null;
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
        rol: 'director',
      },
      {
        id: 2,
        nombre: 'Maria Gomez',
        email: 'maria@rbsdna.com',
        rol: 'director',
      },
      {
        id: 3,
        nombre: 'Juan Perez',
        email: 'juan@rbsdna.com',
        rol: 'jefe',
      },
      {
        id: 4,
        nombre: 'Ana Torres',
        email: 'ana@rbsdna.com',
        rol: 'inspector',
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
    //if (!this.isBrowser) return;

    localStorage.removeItem(this.token);
    localStorage.removeItem(this.usuario);
    this.autenticado.set(false);
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }

  actualizarRolActivo(nuevo_rol: UserRole): void {
    const usuario = this.usuarioActual();
    if (usuario) {
      this.usuarioActual.set({
        ...usuario,
        rol: nuevo_rol,
      });
    }
  }
}
