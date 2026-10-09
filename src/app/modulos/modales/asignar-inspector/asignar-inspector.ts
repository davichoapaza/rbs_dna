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
import { FormsModule } from '@angular/forms';
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
  nombreAerodromo: string;
  activo: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

// Modelos mapeados para el vista/formulario
export interface Inspector {
  id: number;
  nombreCompleto: string;
  especialidad: string;
  indicadoresSeleccionados: number[]; // IDs de aeródromos seleccionados
}

export interface ModalDesignarData {
  cite: string;
  especialidadDefecto?: string; // Ej: 'INSP. AGA' o 'INSP. CNS'
}

@Component({
  selector: 'app-modal-asignar-inspector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  errorMensaje: string | null = null;
  inspectores: Inspector[] = [];
  opcionesIndicadores: IndicadorLugarApi[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalAsignarInspectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalDesignarData,
  ) {}

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
        console.log('=== DEBUG MODAL ===');
        console.log('Respuesta Usuarios:', resUsuarios);
        console.log('Respuesta Indicadores:', resIndicadores);

        // 1. Mapeo de Indicadores
        const listaIndicadores = Array.isArray(resIndicadores)
          ? resIndicadores
          : resIndicadores?.datos || [];

        this.opcionesIndicadores = listaIndicadores.filter(
          (ind: any) => ind.activo === 'AC' || !ind.activo,
        );

        // 2. Mapeo de Usuarios
        const especialidad = this.data.especialidadDefecto || 'INSP. AGA';

        if (resUsuarios && resUsuarios.exito && Array.isArray(resUsuarios.datos)) {
          this.inspectores = resUsuarios.datos.map((usr: any) => ({
            id: usr.id,
            nombreCompleto:
              `${usr.primerApellido ? usr.primerApellido.trim() : ''} ${usr.segundoApellido ? usr.segundoApellido.trim() : ''} ${usr.nombres ? usr.nombres.trim() : ''}`.trim(),
            especialidad: especialidad,
            indicadoresSeleccionados: [],
          }));
        } else {
          this.errorMensaje = 'No se encontraron inspectores registrados para esta área.';
        }

        this.cargando = false;
        this.cdr.markForCheck(); // Notificar a Angular que actualice el HTML
      },
      error: (err) => {
        console.error('Error crítico:', err);
        this.errorMensaje = 'Ocurrió un error al conectar con el servidor.';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  guardarConfiguracion(): void {
    this.dialogRef.close({ accion: 'guardar', inspectores: this.inspectores });
  }

  notificarEIniciar(): void {
    this.dialogRef.close({ accion: 'notificar_iniciar', inspectores: this.inspectores });
  }
}

/*
import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';

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
  nombreAerodromo: string;
  activo: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

// Modelos mapeados para el vista/formulario
export interface Inspector {
  id: number;
  nombreCompleto: string;
  especialidad: string;
  indicadoresSeleccionados: number[]; // IDs de aeródromos seleccionados
}

export interface ModalDesignarData {
  cite: string;
  especialidadDefecto?: string; // Ej: 'INSP. AGA' o 'INSP. CNS'
}

@Component({
  selector: 'app-modal-asignar-inspector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './asignar-inspector.html',
  styleUrl: './asignar-inspector.css',
  //templateUrl: './modal-asignar-inspector.component.html',
  //styleUrls: ['./modal-asignar-inspector.component.scss']
})
export class ModalAsignarInspectorComponent implements OnInit {
  private http = inject(HttpClient);

  cargando = true;
  inspectores: Inspector[] = [];
  opcionesIndicadores: IndicadorLugarApi[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalAsignarInspectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalDesignarData,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    const urlUsuarios =
      'http://localhost:8080/api/v1/seguridad/usuarios/rol/3/especialidad/0/area/2';
    const urlIndicadores = 'http://localhost:8080/api/indicadores-lugar';

    forkJoin({
      resUsuarios: this.http.get<ApiResponseUsuarios>(urlUsuarios),
      resIndicadores: this.http.get<IndicadorLugarApi[]>(urlIndicadores),
    }).subscribe({
      next: ({ resUsuarios, resIndicadores }) => {
        this.opcionesIndicadores = resIndicadores.filter((ind) => ind.activo === 'AC');

        const especialidad = this.data.especialidadDefecto || 'INSP. AGA';

        if (resUsuarios.exito && resUsuarios.datos) {
          this.inspectores = resUsuarios.datos.map((usr) => ({
            id: usr.id,
            nombreCompleto: `${usr.primerApellido.trim()} ${usr.segundoApellido?.trim() || ''} ${usr.nombres.trim()}`,
            especialidad: especialidad,
            indicadoresSeleccionados: [],
          }));
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener datos del servidor:', err);
        this.cargando = false;
      },
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  guardarConfiguracion(): void {
    this.dialogRef.close({ accion: 'guardar', inspectores: this.inspectores });
  }

  notificarEIniciar(): void {
    this.dialogRef.close({ accion: 'notificar_iniciar', inspectores: this.inspectores });
  }
}
*/
/*
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
//import { ModalDesignarData } from './modal-asignar-inspector.interface';
export interface Inspector {
  id: number;
  nombre: string;
  especialidad: string; // ej: 'INSP. AGA'
  indicadoresSeleccionados?: string[];
}

export interface ModalDesignarData {
  cite: string;
  inspectores: Inspector[];
  opcionesIndicadores: string[];
}
@Component({
  selector: 'app-asignar-inspector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './asignar-inspector.html',
  styleUrl: './asignar-inspector.css',
})
export class ModalAsignarInspectorComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalAsignarInspectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalDesignarData,
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }

  guardarConfiguracion(): void {
    this.dialogRef.close({ accion: 'guardar', inspectores: this.data.inspectores });
  }

  notificarEIniciar(): void {
    this.dialogRef.close({ accion: 'notificar_iniciar', inspectores: this.data.inspectores });
  }
}
*/
