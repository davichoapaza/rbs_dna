import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Auth, UserRole } from '../../../core/services/auth';
import { Menu } from '../../../core/services/menu';

export interface MenuItem {
  path: string;
  icon: string;
  label: string;
  roles?: UserRole[]; // Roles que pueden ver este item
}

@Component({
  selector: 'app-sidebar',
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
  private auth = inject(Auth);
  private router = inject(Router);
  private menu = inject(Menu);
  menuItems: MenuItem[] = [];
  // menuFiltrado: MenuItem[] = [];
  constructor() {
    this.menuItems = this.menu.menuItems;
    console.log('Usuario actual:', this.usuario);
    console.log('averias filtradas por rol:', this.menuItems);
  }

  logout() {
    this.auth.logout();
  }
}
