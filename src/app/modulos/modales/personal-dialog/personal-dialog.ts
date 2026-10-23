/*import { Component } from '@angular/core';
@Component({
  selector: 'app-personal-dialog',
  imports: [],
  templateUrl: './personal-dialog.html',
  styleUrl: './personal-dialog.css',
})
export class PersonalDialog {}
*/

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdRef = inject(ChangeDetectorRef);

  formPersona!: FormGroup;
  isEdit = false;

  unidades: any[] = [];
  especialidades: any[] = [];
  roles: any[] = [];

  ngOnInit(): void {
    this.isEdit = !!this.data?.persona;
    this.initForm();
    this.cargarCatalogosIniciales();

    // Escuchar cambios interactivos en el selector de unidad
    this.formPersona.get('unidadId')?.valueChanges.subscribe((unidadId) => {
      if (unidadId) {
        this.cargarEspecialidadesPorUnidad(Number(unidadId), false);
      } else {
        this.especialidades = [];
        this.formPersona.get('especialidadId')?.setValue('');
      }
    });
  }

  initForm(): void {
    const p = this.data?.persona || {};

    // Mapeo flexible para soportar atributos directos u objetos anidados del backend
    const unidadIdVal = p.unidadId || p.unidad_id || p.paramUnidad?.id || '';
    const especialidadIdVal =
      p.especialidadId || p.especialidad_id || p.paramEspecialidad?.id || '';
    const rolIdVal = p.rolId || p.rol_id || p.rol?.id || '';

    this.formPersona = this.fb.group({
      nombres: [p.nombres || '', Validators.required],
      primer_apellido: [p.primerApellido || p.primer_apellido || '', Validators.required],
      segundo_apellido: [p.segundoApellido || p.segundo_apellido || ''],
      ci: [p.ci || '', Validators.required],
      username: [p.username || '', Validators.required],
      unidadId: [unidadIdVal, Validators.required],
      especialidadId: [especialidadIdVal, Validators.required],
      rolId: [rolIdVal, Validators.required],
    });
  }

  cargarCatalogosIniciales(): void {
    // 1. Cargar Unidades y luego verificar si es edición para precargar especialidades
    this.usuariosService.obtenerUnidades().subscribe({
      next: (res) => {
        this.unidades = res;
        this.cdRef.detectChanges();

        const unidadIdActual = this.formPersona.get('unidadId')?.value;
        if (unidadIdActual) {
          this.cargarEspecialidadesPorUnidad(Number(unidadIdActual), true);
        }
      },
      error: (err) => console.error('Error al obtener unidades:', err),
    });

    // 2. Cargar Roles
    this.usuariosService.obtenerRoles().subscribe({
      next: (res) => {
        this.roles = res;
        this.cdRef.detectChanges();
      },
      error: (err) => console.error('Error al obtener roles:', err),
    });

    console.log('Roles cargados:', this.roles);
  }

  cargarEspecialidadesPorUnidad(unidadId: number, mantenerEspecialidad: boolean): void {
    this.usuariosService.obtenerEspecialidadesPorUnidad(unidadId).subscribe({
      next: (res) => {
        this.especialidades = res;

        //Si el usuario cambia manualmente la unidad, limpiamos el control de especialidad
        console.log('Especialidades cargadas para unidadId', unidadId, ':', this.especialidades);
        if (!mantenerEspecialidad) {
          this.formPersona.get('especialidadId')?.setValue('');
        }

        // Forzar actualización de renderizado en Angular Material
        this.cdRef.detectChanges();
      },
      error: (err) => console.error('Error al cargar especialidades por unidad:', err),
    });
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
