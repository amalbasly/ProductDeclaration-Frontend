import { Component } from '@angular/core';
import { ValidateEmployeeService } from '../../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prep-sidebar',
  standalone : false,
  templateUrl: './prep-sidebar.component.html',
  styleUrls: ['./prep-sidebar.component.scss']
})
export class PrepSidebarComponent {
  isOpen = false;
  isSubmenuOpen = false;

  constructor(
    public authService: ValidateEmployeeService,
    private router: Router
  ) {}

  toggleSubmenu(): void {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}