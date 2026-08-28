import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JModalDesignarInspector } from '../modales/j-modal-designar-inspector/j-modal-designar-inspector';
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
    MatDialogModule,
  ],
  templateUrl: './j-designar-inspector.html',
  styleUrl: './j-designar-inspector.css',
})
export class JDesignarInspector {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog); // llmar al modal

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

  /*designarInspector(registro: InspeccionAsignada): void {
    console.log('Designar Inspector para:', registro);
  }

  asignar(registro: InspeccionAsignada): void {
    console.log('Asignar inspección:', registro);
  }*/

  designarInspector(registro: InspeccionAsignada): void {
    console.log('Designar Inspector para:', registro);

    const dialogRef = this.dialog.open(JModalDesignarInspector, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true, // Evita cerrar al hacer clic afuera accidentalmente
      data: {
        cite: registro.numeroCite,
        estado: registro.estadoOperativo,
      },
    });

    // Suscripción al resultado enviado al cerrar el modal (ej. al hacer clic en "Notificar e Iniciar")
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        console.log('Datos recibidos tras cerrar el modal:', resultado);
        // Aquí puedes realizar llamadas al backend o refrescar la tabla
      }
    });
  }

  asignar(registro: InspeccionAsignada): void {
    console.log('Asignar inspección:', registro);
  }
}
