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

  // Guardador de estado persistente indexado por CITE
  private configuracionesGuardadas = new Map<string, any[]>();

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
    const cite = registro.numeroCite;

    const dialogRef = this.dialog.open(JModalDesignarInspector, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        cite: registro.numeroCite,
        estado: registro.estadoOperativo,
        // Enviar datos guardados previamente para este CITE (si existen)
        asignacionesPrevias: this.configuracionesGuardadas.get(cite) || [],
        //asignacionesPrevias: this.configuracionesGuardadas.get(cite) || [],
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado && resultado.inspectores) {
        // Almacenar las selecciones devueltas
        this.configuracionesGuardadas.set(cite, resultado.inspectores);
        console.log('Asignaciones persistidas para', cite, ':', resultado.inspectores);
      }
    });
  }

  asignar(registro: InspeccionAsignada): void {
    const cite = registro.numeroCite;

    // Obtener los datos configurados en el modal para este CITE
    const asignacionesGuardadas = this.configuracionesGuardadas.get(cite) || [];

    // Filtrar solo los inspectores a los que se les asignó al menos un indicador
    const inspectoresAsignados = asignacionesGuardadas.filter(
      (item: any) => item.indicadoresSeleccionados && item.indicadoresSeleccionados.length > 0,
    );

    // Objeto consolidado listo para enviar al backend
    const payloadFinal = {
      ...registro,
      inspectoresAsignados: inspectoresAsignados,
    };

    console.log('Asignación Final enviada:', payloadFinal);
  }
}
