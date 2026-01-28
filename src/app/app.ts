import { Component, signal } from '@angular/core';
import { MainLayoutComponent } from './core/layout';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('selfservices-2');
}
