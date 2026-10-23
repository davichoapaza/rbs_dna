import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuariosService } from '../../core/services/usuarios-service';
import { PersonalDialog } from '../modales/personal-dialog/personal-dialog';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit, OnDestroy {
  private usuariosService = inject(UsuariosService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private cdRef = inject(ChangeDetectorRef); // <-- 1. Inyectar ChangeDetectorRef

  private routerSubscription!: Subscription;

  listaPersonal: any[] = [];
  filtroTexto: string = '';

  ngOnInit(): void {
    this.cargarPersonal();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url.includes('/usuarios')) {
          this.cargarPersonal();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  cargarPersonal(): void {
    this.usuariosService.obtenerPersonal().subscribe({
      next: (data) => {
        this.listaPersonal = data;
        console.log('Personal cargado correctamente:', this.listaPersonal);

        // <-- 2. Forzar la actualización visual inmediata de la tabla
        this.cdRef.detectChanges();
      },
      error: (err) => console.error('Error al obtener personal:', err),
    });
  }

  abrirModal(persona: any = null): void {
    const dialogRef = this.dialog.open(PersonalDialog, {
      width: '650px',
      data: { persona },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarPersonal();
      }
    });
  }

  toggleEstado(persona: any): void {
    console.log(
      `Intentando cambiar estado de usuarioId ${persona.usuarioId} (actualmente bloqueado: ${persona.bloqueado})`,
    );
    const nuevoEstado = !persona.bloqueado;
    console.log(`Cambiando estado de usuarioId ${persona.usuarioId} a bloqueado: ${nuevoEstado}`);
    this.usuariosService.cambiarEstadoUsuario(persona.usuarioId, nuevoEstado).subscribe({
      next: () => this.cargarPersonal(),
      error: (err) => console.error('Error al cambiar estado:', err),
    });
  }
}
