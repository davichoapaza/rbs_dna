/*import { Component } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  imports: [],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {}
*/
import { Component, OnInit, inject } from '@angular/core';
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
//import { PersonalDialogComponent } from './personal-dialog.component';

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
export class Usuarios implements OnInit {
  private usuariosService = inject(UsuariosService);
  private dialog = inject(MatDialog);

  listaPersonal: any[] = [];
  filtroTexto: string = '';

  ngOnInit(): void {
    this.cargarPersonal();
  }

  cargarPersonal(): void {
    this.usuariosService.obtenerPersonal().subscribe({
      next: (data) => (this.listaPersonal = data),
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
    const nuevoEstado = !persona.bloqueado;
    this.usuariosService.cambiarEstadoUsuario(persona.usuario_id, nuevoEstado).subscribe({
      next: () => this.cargarPersonal(),
      error: (err) => console.error('Error al cambiar estado:', err),
    });
  }
}
