import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './mi-cuenta.html',
  styleUrl: './mi-cuenta.css',
})
export class MiCuenta {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MiCuenta>, { optional: true });
  private usuarioService = inject(Auth);
  private snackBar = inject(MatSnackBar);

  cargando = false;
  ocultarActual = true;
  ocultarNueva = true;
  ocultarRepetir = true;

  passwordForm: FormGroup = this.fb.group(
    {
      passwordActual: ['', [Validators.required]],
      passwordNueva: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
        ],
      ],
      repetirPassword: ['', [Validators.required]],
    },
    { validators: this.validarPasswordsIguales },
  );

  private validarPasswordsIguales(control: AbstractControl): ValidationErrors | null {
    const nueva = control.get('passwordNueva')?.value;
    const repetir = control.get('repetirPassword')?.value;

    if (nueva && repetir && nueva !== repetir) {
      control.get('repetirPassword')?.setErrors({ noCoinciden: true });
      return { noCoinciden: true };
    }

    return null;
  }

  guardarPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.cargando = true;

    console.log(' dddddddd  Datos a enviar:', this.passwordForm.value);

    const payload = {
      passwordActual: this.passwordForm.value.passwordActual,
      passwordNueva: this.passwordForm.value.passwordNueva,
    };

    this.usuarioService.cambiarPassword(payload).subscribe({
      next: (res) => {
        this.cargando = false;
        this.snackBar.open(res.mensaje || 'Contraseña actualizada con éxito', 'Aceptar', {
          duration: 4000,
        });
        if (this.dialogRef) {
          this.dialogRef.close(true);
        } else {
          this.passwordForm.reset();
        }
      },
      error: (err) => {
        this.cargando = false;
        const mensajeError = err.error?.mensaje || 'Error al cambiar la contraseña';
        this.snackBar.open(mensajeError, 'Cerrar', {
          duration: 4000,
        });
      },
    });
  }
  cancelar(): void {
    if (this.dialogRef) {
      this.dialogRef.close(); // Cierra el modal de Angular Material
    } else {
      this.passwordForm.reset(); // Resetea el formulario si no es un modal
    }
  }
}

/*import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog'; // Solo si lo usas dentro de un modal

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './mi-cuenta.html',
  styleUrl: './mi-cuenta.css',
})
export class MiCuenta {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MiCuenta>, { optional: true });
  // Descomentar esta línea si usas el formulario dentro de un MatDialog
  // private dialogRef = inject(MatDialogRef<CambiarPasswordComponent>, { optional: true });

  ocultarActual = true;
  ocultarNueva = true;
  ocultarRepetir = true;

  passwordForm: FormGroup = this.fb.group(
    {
      passwordActual: ['', [Validators.required]],
      passwordNueva: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
        ],
      ],
      repetirPassword: ['', [Validators.required]],
    },
    { validators: this.validarPasswordsIguales },
  );

  private validarPasswordsIguales(control: AbstractControl): ValidationErrors | null {
    const nueva = control.get('passwordNueva')?.value;
    const repetir = control.get('repetirPassword')?.value;

    if (nueva && repetir && nueva !== repetir) {
      control.get('repetirPassword')?.setErrors({ noCoinciden: true });
      return { noCoinciden: true };
    }

    return null;
  }

  guardarPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    console.log('Datos a enviar:', this.passwordForm.value);
  
  }

  cancelar(): void {
    if (this.dialogRef) {
      this.dialogRef.close(); // Cierra el modal de Angular Material
    } else {
      this.passwordForm.reset(); // Resetea el formulario si no es un modal
    }
  }
}
*/
