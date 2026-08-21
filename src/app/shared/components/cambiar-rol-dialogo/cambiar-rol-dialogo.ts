import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { UserRole } from '../../../core/services/menu';
export interface DialogDataCambiarRol {
  rolesDisponibles: UserRole[];
  rolActual: UserRole;
}

@Component({
  selector: 'app-cambiar-rol-dialogo',
  imports: [CommonModule, FormsModule, MatDialogModule, MatRadioModule, MatButtonModule],
  templateUrl: './cambiar-rol-dialogo.html',
  styleUrl: './cambiar-rol-dialogo.css',
})
export class CambiarRolDialogo {
  dialogRef = inject(MatDialogRef<CambiarRolDialogo>);
  data = inject<DialogDataCambiarRol>(MAT_DIALOG_DATA);

  rolSeleccionado: UserRole = this.data.rolActual;

  cancelar(): void {
    this.dialogRef.close();
  }

  confirmar(): void {
    console.log('david apaza:', this.rolSeleccionado);
    this.dialogRef.close(this.rolSeleccionado);
  }
}
