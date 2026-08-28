import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface Inspector {
  id: number;
  cargo: string;
  nombreCompleto: string;
}

export interface IndicadorLugar {
  codigo: string;
  nombre: string;
}

export interface DatosModalDesignar {
  cite: string;
  estado: string;
}

@Component({
  selector: 'app-j-designar-inspector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './j-modal-designar-inspector.html',
  styleUrl: './j-modal-designar-inspector.css',
})
export class JModalDesignarInspector implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<JModalDesignarInspector>);

  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosModalDesignar) {}

  // Formulario Reactivo principal
  formularioAsignacion: FormGroup = this.fb.group({
    inspectores: this.fb.array([]),
  });

  // Datos dummy de inspectores
  listaInspectores: Inspector[] = [
    { id: 1, cargo: 'INSP. AGA', nombreCompleto: 'Mendizabal Camacho Luis Fernando' },
    { id: 2, cargo: 'INSP. AGA', nombreCompleto: 'Vargas Sejas Juan Cox' },
    { id: 3, cargo: 'INSP. AGA', nombreCompleto: 'Zubieta Zubieta Hugo Alberto' },
    { id: 4, cargo: 'INSP. AGA', nombreCompleto: 'Sanabria Torrico Carlos' },
  ];

  // Datos de indicadores de lugar (Aeródromos / Ubicaciones)
  listaIndicadores: IndicadorLugar[] = [
    { codigo: 'SLPO', nombre: 'SLPO - Potosi / Capitan Nicolas Rojas' },
    { codigo: 'SLOR', nombre: 'SLOR - Oruro / Juan Mendoza' },
    { codigo: 'SLSB', nombre: 'SLSB - San Borja' },
    { codigo: 'SLRI', nombre: 'SLRI - Riberalta' },
    { codigo: 'SLGY', nombre: 'SLGY - Guayaramerin' },
  ];

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  get arregloInspectores(): FormArray {
    return this.formularioAsignacion.get('inspectores') as FormArray;
  }

  inicializarFormulario(): void {
    this.listaInspectores.forEach((inspector) => {
      this.arregloInspectores.push(
        this.fb.group({
          idInspector: [inspector.id],
          cargo: [inspector.cargo],
          nombreCompleto: [inspector.nombreCompleto],
          indicadoresSeleccionados: [[]],
        }),
      );
    });
  }

  // Lógica para el checkbox "[ Seleccionar Todos ]"
  seleccionarTodos(indice: number, evento: any): void {
    const controlIndicadores = this.arregloInspectores.at(indice).get('indicadoresSeleccionados');
    if (evento.checked) {
      const todosCodigos = this.listaIndicadores.map((item) => item.codigo);
      controlIndicadores?.setValue(todosCodigos);
    } else {
      controlIndicadores?.setValue([]);
    }
  }

  esTodosSeleccionados(indice: number): boolean {
    const seleccionados: string[] =
      this.arregloInspectores.at(indice).get('indicadoresSeleccionados')?.value || [];
    return seleccionados.length === this.listaIndicadores.length;
  }

  guardarConfiguracion(): void {
    console.log('Configuración Guardada:', this.formularioAsignacion.value);
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
