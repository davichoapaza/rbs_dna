/*import { Component } from '@angular/core';

@Component({
  selector: 'app-asignar-inspector',
  imports: [],
  templateUrl: './asignar-inspector.html',
  styleUrl: './asignar-inspector.css',
})
export class AsignarInspector {}
*/

import { Component, Inject, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ApiResponseUsuarios {
  exito: boolean;
  mensaje: string;
  datos: UsuarioApi[];
}

export interface UsuarioApi {
  id: number;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  ci: string;
}

export interface IndicadorLugarApi {
  id: number;
  codigoOaci: string;
  ciudad: string;
  nombreAerodromo: string;
  activo: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

export interface ModalDesignarData {
  cite: string;
  especialidadDefecto?: string;
}

@Component({
  selector: 'app-modal-asignar-inspector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './asignar-inspector.html',
  styleUrl: './asignar-inspector.css',
})
export class ModalAsignarInspectorComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  errorMensaje: string | null = null;
  opcionesIndicadores: IndicadorLugarApi[] = [];

  form: FormGroup = this.fb.group({
    inspectores: this.fb.array([]),
  });

  constructor(
    public dialogRef: MatDialogRef<ModalAsignarInspectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalDesignarData,
  ) {}

  get inspectoresArray(): FormArray {
    return this.form.get('inspectores') as FormArray;
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMensaje = null;

    const urlUsuarios =
      'http://localhost:8080/api/v1/seguridad/usuarios/rol/3/especialidad/0/area/2';
    const urlIndicadores = 'http://localhost:8080/api/indicadores-lugar';

    forkJoin({
      resUsuarios: this.http.get<ApiResponseUsuarios>(urlUsuarios).pipe(
        catchError((err) => {
          console.error('Error al obtener usuarios:', err);
          return of(null);
        }),
      ),
      resIndicadores: this.http.get<IndicadorLugarApi[] | any>(urlIndicadores).pipe(
        catchError((err) => {
          console.error('Error al obtener indicadores de lugar:', err);
          return of([]);
        }),
      ),
    }).subscribe({
      next: ({ resUsuarios, resIndicadores }) => {
        // 1. Mapear Indicadores
        const listaIndicadores = Array.isArray(resIndicadores)
          ? resIndicadores
          : resIndicadores?.datos || [];

        this.opcionesIndicadores = listaIndicadores.filter(
          (ind: any) => ind.activo === 'AC' || !ind.activo,
        );

        // 2. Construir FormArray de Inspectores
        const especialidad = this.data.especialidadDefecto || 'INSP. AGA';

        if (resUsuarios && resUsuarios.exito && Array.isArray(resUsuarios.datos)) {
          const formGroups = resUsuarios.datos.map((usr: any) => {
            const nombreCompleto =
              `${usr.primerApellido ? usr.primerApellido.trim() : ''} ${usr.segundoApellido ? usr.segundoApellido.trim() : ''} ${usr.nombres ? usr.nombres.trim() : ''}`.trim();

            return this.fb.group({
              id: [usr.id],
              nombreCompleto: [nombreCompleto],
              especialidad: [especialidad],
              indicadoresSeleccionados: [[]],
            });
          });

          this.form = this.fb.group({
            inspectores: this.fb.array(formGroups),
          });
        } else {
          this.errorMensaje = 'No se encontraron inspectores registrados para esta área.';
        }

        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error crítico:', err);
        this.errorMensaje = 'Ocurrió un error al conectar con el servidor.';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Filtra las opciones de aeropuertos para que un indicador ya seleccionado
   * por otro inspector no aparezca disponible en los demás dropdowns.
   */
  getOpcionesDisponibles(indexActual: number): IndicadorLugarApi[] {
    const idsSeleccionadosPorOtros = new Set<number>();

    this.inspectoresArray.controls.forEach((ctrl, idx) => {
      if (idx !== indexActual) {
        const seleccionados = ctrl.get('indicadoresSeleccionados')?.value || [];
        seleccionados.forEach((id: number) => idsSeleccionadosPorOtros.add(id));
      }
    });

    return this.opcionesIndicadores.filter((ind) => !idsSeleccionadosPorOtros.has(ind.id));
  }

  /**
   * Selecciona todos los indicadores disponibles restantes para el inspector actual.
   */
  seleccionarTodos(index: number): void {
    const inspectorCtrl = this.inspectoresArray.at(index);
    const disponibles = this.getOpcionesDisponibles(index);
    const idsDisponibles = disponibles.map((d) => d.id);
    const actuales: number[] = inspectorCtrl.get('indicadoresSeleccionados')?.value || [];

    if (this.isTodosSeleccionados(index)) {
      // Si ya estaban todos seleccionados, los deseleccionamos (los removemos)
      const filtrados = actuales.filter((id) => !idsDisponibles.includes(id));
      inspectorCtrl.get('indicadoresSeleccionados')?.setValue(filtrados);
    } else {
      // Si faltaba alguno, los agregamos todos
      const combinados = Array.from(new Set([...actuales, ...idsDisponibles]));
      inspectorCtrl.get('indicadoresSeleccionados')?.setValue(combinados);
    }
  }
  cerrar(): void {
    this.dialogRef.close();
  }

  guardarConfiguracion(): void {
    if (this.form.invalid) return;
    this.dialogRef.close({ accion: 'guardar', inspectores: this.form.value.inspectores });
  }

  notificarEIniciar(): void {
    if (this.form.invalid) return;
    this.dialogRef.close({ accion: 'notificar_iniciar', inspectores: this.form.value.inspectores });
  }

  /**
   * Verifica si todos los indicadores disponibles ya están seleccionados por este inspector.
   */
  isTodosSeleccionados(index: number): boolean {
    const disponibles = this.getOpcionesDisponibles(index);
    if (disponibles.length === 0) return false;

    const inspectorCtrl = this.inspectoresArray.at(index);
    const actuales: number[] = inspectorCtrl.get('indicadoresSeleccionados')?.value || [];

    return disponibles.every((d) => actuales.includes(d.id));
  }

  /**
   * Alterna entre seleccionar todos los disponibles o deseleccionarlos.
   */
}
