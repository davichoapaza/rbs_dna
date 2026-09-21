import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth } from '../../../core/services/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { OlvidoContrasenia } from '../../olvido-contrasenia/olvido-contrasenia';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<OlvidoContrasenia>, { optional: true });
  loginForm: FormGroup;
  hidePassword = true;
  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });

    if (this.auth.loggin()) {
      this.router.navigate(['/inicio']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const { usuario, password } = this.loginForm.value;
    this.auth.inicioSession(usuario, password).subscribe({
      next: (valido) => {
        this.loading.set(false);

        if (valido) {
          this.router.navigate(['/inicio']);
        } else {
          this.errorMessage.set('Usuario o contraseña incorrectos');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set('Ocurrió un error al conectar con el servidor');
        console.error('Error en login:', err);
      },
    });
  }

  abrirOlvidoContrasenia(): void {
    console.log('preciono olvido contrasenia');

    const dialogRef = this.dialog.open(OlvidoContrasenia, {
      width: '400px',
      height: 'auto', // Se ajusta automáticamente al contenido

      disableClose: true,
    });
  }
}
