import { Component } from '@angular/core';
import { ValidateEmployeeService } from '../../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-traca-sidebar',
  standalone: false,
  templateUrl: './traca-sidebar.component.html',
  styleUrl: './traca-sidebar.component.scss'
})
export class TracaSidebarComponent {
   isOpen = true; // Keep open by default on desktop
    isSubmenuOpen = false;
    isGalliaSubmenuOpen = false;
    isLabelSubmenuOpen = false;
    isFlanSubmenuOpen = false;
    isAssemblySubmenuOpen = false;
  
    constructor(
      public authService: ValidateEmployeeService,
      private router: Router
    ) {}
  
    toggleSubmenu(): void {
      this.isSubmenuOpen = !this.isSubmenuOpen;
    }
  
    toggleGalliaSubmenu(): void {
      this.isGalliaSubmenuOpen = !this.isGalliaSubmenuOpen;
    }
  
    toggleLabelSubmenu(): void {
      this.isLabelSubmenuOpen = !this.isLabelSubmenuOpen;
    }
  
    toggleFlanSubmenu(): void {
      this.isFlanSubmenuOpen = !this.isFlanSubmenuOpen;
    }
    toggleAssemblySubmenu(): void {
      this.isAssemblySubmenuOpen = !this.isAssemblySubmenuOpen;
    }
  
}
