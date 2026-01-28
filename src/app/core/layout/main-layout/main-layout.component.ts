/**
 * Main Layout Component
 *
 * Main application layout that includes Header, Sidebar, Footer, and router-outlet.
 * Provides responsive layout with RTL support.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  // Inject service
  public layoutService = inject(LayoutService);

  // Layout state
  sidebarCollapsed = this.layoutService.sidebarCollapsed;
  isRTL = this.layoutService.isRTL;
}
