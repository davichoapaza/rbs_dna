import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

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
export class DDireccionInicio {
  private fb = inject(FormBuilder);

  // Formulario Reactivo principal
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

  fuenteDatos: RegistroDocumento[] = [
    {
      id: 1,
      cite: 'dgac-123456/2026',
      nombreArchivo: 'documento.pdf',
      estado: '[D] BORRADOR',
      actorActual: 'Dirección DNA',
      subtextoActor: 'Pendiente de instruir',
      fecha: '26/08/2026 09:44',
    },
  ];

  alSeleccionarArchivo(evento: Event): void {
    const elementoInput = evento.target as HTMLInputElement;
    if (elementoInput.files && elementoInput.files.length > 0) {
      const archivo = elementoInput.files[0];
      this.nombreArchivoSeleccionado = archivo.name;

      // Asignar archivo al Form Control
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
    const nuevoRegistro: RegistroDocumento = {
      id: this.fuenteDatos.length + 1,
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
  }

  instruir(registro: RegistroDocumento): void {
    console.log('Instruir registro:', registro);
  }

  eliminar(id: number): void {
    this.fuenteDatos = this.fuenteDatos.filter((item) => item.id !== id);
  }
}
