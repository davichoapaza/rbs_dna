/*import { Component } from '@angular/core';
@Component({
  selector: 'app-personal-dialog',
  imports: [],
  templateUrl: './personal-dialog.html',
  styleUrl: './personal-dialog.css',
})
export class PersonalDialog {}
*/

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UsuariosService } from '../../../core/services/usuarios-service';

@Component({
  selector: 'app-personal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './personal-dialog.html',
  styleUrl: './personal-dialog.css',
})
export class PersonalDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PersonalDialog>);
  public data = inject(MAT_DIALOG_DATA);
  private usuariosService = inject(UsuariosService);

  formPersona!: FormGroup;
  isEdit = false;

  unidades: any[] = [];
  especialidades: any[] = [];
  roles: any[] = [];

  ngOnInit(): void {
    this.isEdit = !!this.data?.persona;
    this.initForm();
    this.cargarCatalogos();
  }

  initForm(): void {
    const p = this.data?.persona || {};
    this.formPersona = this.fb.group({
      nombres: [p.nombres || '', Validators.required],
      primer_apellido: [p.primer_apellido || '', Validators.required],
      segundo_apellido: [p.segundo_apellido || ''],
      ci: [p.ci || '', Validators.required],
      username: [p.username || '', Validators.required],
      unidadId: [p.unidadId || '', Validators.required],
      especialidadId: [p.especialidadId || '', Validators.required],
      rolId: [p.rolId || '', Validators.required],
    });
  }

  cargarCatalogos(): void {
    this.usuariosService.obtenerUnidades().subscribe((res) => (this.unidades = res));
    this.usuariosService.obtenerEspecialidades().subscribe((res) => (this.especialidades = res));
    this.usuariosService.obtenerRoles().subscribe((res) => (this.roles = res));
  }

  guardar(): void {
    if (this.formPersona.invalid) return;

    const payload = this.formPersona.value;

    if (this.isEdit) {
      this.usuariosService.actualizarPersona(this.data.persona.id, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Error al actualizar:', err),
      });
    } else {
      this.usuariosService.registrarPersona(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Error al registrar:', err),
      });
    }
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}
