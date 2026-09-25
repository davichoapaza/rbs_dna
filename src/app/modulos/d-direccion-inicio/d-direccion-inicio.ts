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

  cargarDatosTabla(): void {
    this.flujoService.obtenerOrdenesInspeccion().subscribe({
      next: (response) => {
        console.log('Datos recibidos del backend:', response);

        // Si la respuesta viene envuelta en una estructura genérica como (response.datos o response)
        const listaDatos = Array.isArray(response) ? response : response.datos || [];

        // Mapeo de la respuesta del servidor a la interfaz RegistroDocumento
        this.fuenteDatos = listaDatos.map((item: any) => ({
          id: item.id,
          cite: item.codigoOrden || item.cite || 'SIN CITE',
          nombreArchivo: item.titulo || item.nombreArchivo || 'documento.pdf',
          estado: item.estado || '[D] BORRADOR',
          actorActual: item.actorActual || 'Dirección DNA',
          subtextoActor: item.subtextoActor || 'Pendiente de instruir',
          fecha: item.fechaCreacion
            ? new Date(item.fechaCreacion).toLocaleString('es-BO')
            : new Date().toLocaleString('es-BO'),
        }));

        // Forzar la detección de cambios después de actualizar la fuente de datos
        // se ejecuta para asegurarse de que la vista se actualice correctamente después de recibir los datos del backend
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error al cargar la lista de órdenes de inspección:', error);
      },
    });
  }

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

  instruir(registro: RegistroDocumento): void {
    console.log('Instruir registro:', registro);
  }

  eliminar(id: number): void {
    this.fuenteDatos = this.fuenteDatos.filter((item) => item.id !== id);
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
