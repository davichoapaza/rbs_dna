import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

export interface InspeccionAsignada {
  numero: number;
  especialidad: string;
  numeroCite: string;
  estadoOperativo: string;
  fechaNotificacion: string;
}

@Component({
  selector: 'app-registro-inspecciones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './i-asignaciones.html',
  styleUrl: './i-asignaciones.css',
})
export class IAsignaciones {
  private fb = inject(FormBuilder);

  // Formulario Reactivo para gestionar acciones o filtros
  formularioInspeccion: FormGroup = this.fb.group({
    filtroEstado: ['POR DESIGNAR'],
  });

  columnasDesplegadas: string[] = [
    'numero',
    'especialidad',
    'numeroCite',
    'estadoOperativo',
    'fechaNotificacion',
    'accionesDisponibles',
  ];

  fuenteDatos: InspeccionAsignada[] = [
    {
      numero: 1,
      especialidad: 'AGA',
      numeroCite: 'DGAC-DNA-001/2026',
      estadoOperativo: 'POR DESIGNAR',
      fechaNotificacion: '23/08/2026',
    },
  ];

  designarInspector(registro: InspeccionAsignada): void {
    console.log('Designar Inspector para:', registro);
  }

  asignar(registro: InspeccionAsignada): void {
    console.log('Asignar inspección:', registro);
  }
}

/*import { Component } from '@angular/core';

@Component({
  selector: 'app-i-asignaciones',
  imports: [],
  templateUrl: './i-asignaciones.html',
  styleUrl: './i-asignaciones.css',
})
export class IAsignaciones {}
*/
