import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-olvido-contrasenia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './olvido-contrasenia.html',
  styleUrl: './olvido-contrasenia.css',
})
export class OlvidoContrasenia {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<OlvidoContrasenia>, { optional: true });
  cargando = false;

  // Formulario reactivo para la solicitud de recuperación
  olvidoForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.olvidoForm.invalid) {
      this.olvidoForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const { correo } = this.olvidoForm.value;

    console.log('Enviando solicitud de recuperación para:', correo);

    setTimeout(() => {
      this.cargando = false;
      this.snackBar.open(
        'Se han enviado las instrucciones de recuperación a tu correo.',
        'Aceptar',
        { duration: 4000 },
      );

      if (this.dialogRef) {
        this.dialogRef.close(true);
      }
    }, 1200);
  }

  cancelar(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.olvidoForm.reset();
    }
  }
}
