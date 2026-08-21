import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './core/services/auth';
import { Sidebar } from './shared/components/sidebar/sidebar';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('app-rbs-dna1');
  constructor(private auth: Auth) {}

  loggin(): boolean {
    return this.auth.loggin();
  }
}
