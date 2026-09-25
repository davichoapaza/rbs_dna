import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- Importar OnInit
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Auth } from '../../core/services/auth';
import { CrearBorrador, FlujoOperaciones } from '../../core/services/flujo-operaciones';
import Swal from 'sweetalert2';
export interface RegistroDocumento {
  id: number;
  cite: string;
  nombreArchivo: string;
  estado: string;
  actorActual: string;
  subtextoActor: string;
  fecha: string;
}

@Component({
  selector: 'app-d-direccion-inicio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './d-direccion-inicio.html',
  styleUrl: './d-direccion-inicio.css',
})
export class DDireccionInicio implements OnInit {
  // <-- Agregar implements OnInit
  private fb = inject(FormBuilder);
  public authService = inject(Auth);
  private flujoService = inject(FlujoOperaciones);
  usuario = this.authService.usuarioActual;
  private cdr = inject(ChangeDetectorRef); // para que detecte cualquier cambio hay que inyectar ChangeDetectorRef
  private index: number = 1; // Variable para generar IDs secuenciales
  formularioRegistro: FormGroup = this.fb.group({
    cite: ['', [Validators.required, Validators.minLength(5)]],
    archivoPdf: [null, [Validators.required]],
  });

  nombreArchivoSeleccionado: string = 'Ningún archivo seleccionado';
  columnasDesplegadas: string[] = [
    'id',
    'cite',
    'archivo',
    'estado',
    'actorActual',
    'fecha',
    'acciones',
  ];

  // Inicia vacío para ser llenado desde el backend
  fuenteDatos: RegistroDocumento[] = [];

  ngOnInit(): void {
    this.cargarDatosTabla();
  }
  // Método opcional para manejar la acción 'Ver'
  verDetalle(elemento: any): void {
    console.log('Visualizando orden instruida:', elemento);
    // Aquí puedes abrir un dialog o navegar a la vista de detalles
  }

  cargarDatosTabla(): void {
    this.flujoService.obtenerOrdenesInspeccion().subscribe({
      next: (response) => {
        console.log('Datos recibidos del backend:', response.datos);

        const listaDatos = Array.isArray(response) ? response : response.datos || [];

        this.fuenteDatos = listaDatos.map((item: any) => ({
          id: item.id,
          cite: item.codigoOrden || item.cite || 'SIN CITE',
          nombreArchivo: item.titulo || item.nombreArchivo || 'documento.pdf',
          // Se mapea el estado devuelto por la API
          estado: item.nombreEstado || item.estado || '[D] BORRADOR',
          actorActual: item.actorActual || 'Dirección DNA',
          subtextoActor: item.subtextoActor || 'Pendiente de instruir',
          fecha: item.fechaCreacion
            ? new Date(item.fechaCreacion).toLocaleString('es-BO')
            : new Date().toLocaleString('es-BO'),
        }));

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar la lista de órdenes de inspección:', error);
      },
    });
  }

  /*cargarDatosTabla(): void {
    this.flujoService.obtenerOrdenesInspeccion().subscribe({
      next: (response) => {
        console.log('Datos recibidos del backend:', response.datos);

        // Si la respuesta viene envuelta en una estructura genérica como (response.datos o response)
        const listaDatos = Array.isArray(response) ? response : response.datos || [];

        // Mapeo de la respuesta del servidor a la interfaz RegistroDocumento
        this.fuenteDatos = listaDatos.map((item: any) => ({
          id: item.id,
          // id: this.index++,
          cite: item.codigoOrden || item.cite || 'SIN CITE',
          nombreArchivo: item.titulo || item.nombreArchivo || 'documento.pdf',
          estado: item.nombreEstado || '[D] BORRADOR',
          actorActual: item.actorActual || 'Dirección DNA',
          subtextoActor: item.subtextoActor || 'Pendiente de instruir',
          fecha: item.fechaCreacion
            ? new Date(item.fechaCreacion).toLocaleString('es-BO')
            : new Date().toLocaleString('es-BO'),
        }));

        // Forzar la detección de cambios después de actualizar la fuente de datos
        // se ejecuta para asegurarse de que la vista se actualice
        // correctamente después de recibir los datos del backend
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar la lista de órdenes de inspección:', error);
      },
    });
  }*/

  alSeleccionarArchivo(evento: Event): void {
    const elementoInput = evento.target as HTMLInputElement;
    if (elementoInput.files && elementoInput.files.length > 0) {
      const archivo = elementoInput.files[0];
      this.nombreArchivoSeleccionado = archivo.name;

      this.formularioRegistro.patchValue({
        archivoPdf: archivo,
      });
      this.formularioRegistro.get('archivoPdf')?.updateValueAndValidity();
    }
  }

  adicionarATabla(): void {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    const valoresFormulario = this.formularioRegistro.value;
    const usuarioId = this.usuario()?.id;

    const datosEnviar: CrearBorrador = {
      directorUsuarioRolId: usuarioId,
      codigoOrden: valoresFormulario.cite,
      titulo: this.nombreArchivoSeleccionado,
    };

    this.flujoService.crearBorrador(datosEnviar).subscribe({
      next: (response) => {
        console.log('Borrador creado:', response);

        // Volver a consultar la lista actualizada desde el backend
        this.cargarDatosTabla();

        // Reiniciar formulario
        this.formularioRegistro.reset();
        this.nombreArchivoSeleccionado = 'Ningún archivo seleccionado';
      },
      error: (error) => {
        console.error('Error al registrar el borrador en la API:', error);
      },
    });
  }

  // 2. Confirmación con entrada de Observación para Instruir
  instruir(registro: RegistroDocumento): void {
    Swal.fire({
      title: 'Instruir y Derivar Orden',
      input: 'textarea',
      inputLabel: 'Observaciones',
      inputValue: 'Se instruye la revisión a las jefaturas técnicas',
      showCancelButton: true,
      confirmButtonText: 'Enviar e Instruir',
      cancelButtonText: 'Cancelar',

      inputValidator: (value) => {
        if (!value) {
          return '¡Debe ingresar una observación!';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const observacionIngresada = result.value;
        this.ejecutarFlujoInstruir(registro, observacionIngresada);
      }
    });
  }

  private ejecutarFlujoInstruir(registro: RegistroDocumento, observaciones: string): void {
    this.flujoService.obtenerRolYUsuario(2).subscribe({
      next: (usuariosRolResponse) => {
        const listaUsuarios = Array.isArray(usuariosRolResponse)
          ? usuariosRolResponse
          : usuariosRolResponse?.datos || [];

        const destinatariosIds = listaUsuarios.map((u: any) => u.id);

        const payload = {
          ordenId: registro.id,
          usuarioRolId: this.usuario()?.id ?? 0,
          destinatariosUsuarioRolIds: destinatariosIds,
          observaciones: observaciones, // Usamos la observación digitada en el modal
        };

        this.flujoService.instruirYDerivar(payload).subscribe({
          next: (res) => {
            Swal.fire('Éxito', 'La orden fue instruida y derivada correctamente.', 'success');
            this.cargarDatosTabla();
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo instruir la orden.', 'error');
          },
        });
      },
    });
  }

  /*instruir(registro: RegistroDocumento): void {
    console.log('ID del registro a instruir:', registro.id);

    this.flujoService.obtenerRolYUsuario(2).subscribe({
      next: (usuariosRolResponse) => {
        console.log('Usuarios por rol obtenidos:', usuariosRolResponse);
        const listaUsuarios: any[] = Array.isArray(usuariosRolResponse)
          ? usuariosRolResponse
          : usuariosRolResponse?.datos || [];
        const destinatariosIds: number[] = listaUsuarios.map((u: any) => u.id);
        console.log('los destinatarios Ids son: ', destinatariosIds);
        const payload = {
          ordenId: registro.id,
          usuarioRolId: this.usuario()?.id ?? 0,
          destinatariosUsuarioRolIds: destinatariosIds,
          observaciones: 'Se instruye la revisión a las jefaturas',
        };
        console.log('Payload a enviar:', payload);

        this.flujoService.instruirYDerivar(payload).subscribe({
          next: (res) => {
            console.log('Instrucción enviada con éxito:', res);
            this.cargarDatosTabla(); // Recargar la lista de la tabla
          },
          error: (err) => {
            console.error('Error al instruir y derivar:', err);
          },
        });
      },
    });
  }*/
  /*eliminar(id: number): void {
    console.log('Eliminar registro con ID:', id);

    this.fuenteDatos = this.fuenteDatos.filter((item) => item.id !== id);
  }*/

  // 1. Confirmación para Eliminar
  eliminar(id: number): void {
    Swal.fire({
      title: '¿Confirmar eliminación?',
      text: 'Esta acción no se podrá deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fuenteDatos = this.fuenteDatos.filter((item) => item.id !== id);
        Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
      }
    });
  }
}

/*import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { FlujoService, PayloadCrearBorrador } from '../../core/services/flujo.service';

@Component({
  selector: 'app-d-direccion-inicio',
  templateUrl: './d-direccion-inicio.component.html',
  styleUrls: ['./d-direccion-inicio.component.css']
})
export class DDireccionInicioComponent {
  private authService = inject(Auth);
  private flujoService = inject(FlujoService);

  // Signal del usuario autenticado
  usuario = this.authService.usuarioActual;

  fuenteDatos: RegistroDocumento[] = [];
  nombreArchivoSeleccionado: string = 'Ningún archivo seleccionado';
  formularioRegistro: any; // Instancia de tu FormGroup

  adicionarATabla(): void {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    const valoresFormulario = this.formularioRegistro.value;
    const usuarioId = this.usuario()?.id;

    console.log('Usuario ID detectado:', usuarioId);

    // Mapeo de datos para la petición HTTP
    const payload: PayloadCrearBorrador = {
      usuarioId: usuarioId,
      cite: valoresFormulario.cite,
      nombreArchivo: this.nombreArchivoSeleccionado
    };

    // Llamada al servicio HTTP
    this.flujoService.crearBorrador(payload).subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);

        // Se inserta en la tabla local tras confirmación del servidor
        const nuevoRegistro: RegistroDocumento = {
          id: response.datos?.id ?? (this.fuenteDatos.length + 1),
          cite: valoresFormulario.cite,
          nombreArchivo: this.nombreArchivoSeleccionado,
          estado: '[D] BORRADOR',
          actorActual: 'Dirección DNA',
          subtextoActor: 'Pendiente de instruir',
          fecha: new Date().toLocaleString('es-BO'),
        };

        this.fuenteDatos = [...this.fuenteDatos, nuevoRegistro];

        // Reiniciar formulario
        this.formularioRegistro.reset();
        this.nombreArchivoSeleccionado = 'Ningún archivo seleccionado';
      },
      error: (error) => {
        console.error('Error al registrar el borrador en la API:', error);
      }
    });
  }
}*/
