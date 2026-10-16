/*import { Component } from '@angular/core';

@Component({
  selector: 'app-j-bandeja-revision',
  imports: [],
  templateUrl: './j-bandeja-revision.html',
  styleUrl: './j-bandeja-revision.css',
})
export class JBandejaRevision {}
*/
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// Importaciones de Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlujoOperaciones } from '../../core/services/flujo-operaciones';
import { Auth } from '../../core/services/auth';
import { ModalAsignarInspectorComponent } from '../modales/asignar-inspector/asignar-inspector';
import { MatDialog } from '@angular/material/dialog';
//import { OrdenInspeccionService } from './orden-inspeccion.service';
//import { OrdenInspeccionDto } from './orden-inspeccion.model';
export interface OrdenInspeccionDto {
  id: number;
  especialidad: string;
  codigoOrden: string;
  nombre: string;
  fechaAsignacion: string;
}

export interface ApiResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
}
@Component({
  selector: 'app-j-bandeja-revision',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './j-bandeja-revision.html',
  styleUrl: './j-bandeja-revision.css',
})
export class JBandejaRevision implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ordenService = inject(FlujoOperaciones);
  public authService = inject(Auth);
  private dialog = inject(MatDialog);
  usuario = this.authService.usuarioActual;

  filtroForm!: FormGroup;
  dataSource = new MatTableDataSource<OrdenInspeccionDto>([]);
  displayedColumns: string[] = [
    'numero',
    'especialidad',
    'codigoOrden',
    'nombre',
    'fechaAsignacion',
    'acciones',
  ];

  cargando = false;
  //usuarioId = this.usuario()?.id; // ID de usuario según la sesión actual
  usuarioId = this.usuario()?.id ?? 0;
  rolId = 2; // ID de rol según la sesión actual

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inspectorService: FlujoOperaciones, // <-- Inyección del servicio
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarOrdenes();
  }

  private initForm(): void {
    this.filtroForm = this.fb.group({
      busqueda: [''],
    });

    // Filtro reactivo en tiempo real
    this.filtroForm.get('busqueda')?.valueChanges.subscribe((valor) => {
      this.aplicarFiltro(valor);
    });
  }
  cargarOrdenes(): void {
    console.log('*************usuarioId************************:', this.usuarioId);
    this.cargando = true;
    this.ordenService.obtenerOrdenesInspeccionJefe(this.usuarioId, this.rolId).subscribe({
      next: (res) => {
        if (res.exito && res.datos) {
          this.dataSource.data = res.datos;
          console.log('Datos de la bandeja de revisión:', res.datos);
          console.log('David Apaza CANAZA bandeja de revisión:', this.dataSource.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar la bandeja de revisión:', err);
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(valor: string): void {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  /*designarInspector(orden: OrdenInspeccionDto): void {
    console.log('Designar inspector para la orden:', orden);
  }*/

  designarInspector(item: any): void {
    const dialogRef = this.dialog.open(ModalAsignarInspectorComponent, {
      width: '780px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        // Solo le pasas los datos del ítem seleccionado que el modal necesita mostrar en el título

        cite: item?.memorandumCITE || item?.codigoOrden || 'DGAC-DNA-001/2026',
        especialidadDefecto: `INSP. ${item?.especialidad || 'AGA'}`,
      },
    });

    //  dialogRef.afterClosed().subscribe((resultado) => {
    //   if (resultado) {
    //      console.log('Acción ejecutada:', resultado.accion); // 'guardar' o 'notificar_iniciar'
    //      console.log('Inspectores configurados asignaciones=:', resultado.inspectores);
    //      console.log('Item seleccionado para designar inspector  jefaturaId:', item.id);
    /*
        if (resultado.accion === 'guardar') {
          // Aquí llamas a tu servicio para guardar la configuración
          this.guardarDesignacion(resultado.inspectores);
        } else if (resultado.accion === 'notificar_iniciar') {
          // Aquí llamas a tu servicio para notificar e iniciar inspección
          this.notificarEIniciarInspeccion(resultado.inspectores);
        }*/
    //   }
    // });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        console.log('Acción ejecutada:', resultado.accion); // 'guardar' o 'notificar_iniciar'
        console.log('Inspectores configurados asignaciones=:', resultado.inspectores);
        console.log('Item seleccionado para designar inspector jefaturaId:', item.id);
        console.log('Item seleccionado para designar inspector jefaturaId:', item);

        // Construcción dinámica del payload basado en los datos del diálogo
        const payload = {
          jefaturaId: item.id, // Viene del objeto 'item' (ej. 129)
          estadoId: 1, // ID de estado inicial por defecto (ej. 1)
          asignaciones: resultado.inspectores.map((insp: any) => ({
            inspectorUsuarioRolId: insp.id, // El 'id' del inspector en la interfaz
            indicadoresSeleccionados: insp.indicadoresSeleccionados || [], // Array de IDs de aeródromos
          })),
        };

        console.log('JSON generado para enviar al backend:', JSON.stringify(payload, null, 2));

        // 2. Ejecutar según la acción seleccionada
        if (resultado.accion === 'guardar') {
          this.inspectorService.guardarAsignaciones(payload).subscribe({
            next: (response) => {
              console.log('Guardado exitosamente:', response);
              // Aquí puedes mostrar un mensaje de éxito (ej. usando MatSnackBar) y refrescar tu tabla
            },
            error: (error) => {
              console.error('Error al guardar la asignación:', error);
              // Aquí puedes manejar el mensaje de error visual para el usuario
            },
          });
        } else if (resultado.accion === 'notificar_iniciar') {
          // Si requieres otra lógica o endpoint para notificar e iniciar
        }
      }
    });
  }

  asignar(orden: OrdenInspeccionDto): void {
    console.log('Asignar orden:', orden);
  }
}
