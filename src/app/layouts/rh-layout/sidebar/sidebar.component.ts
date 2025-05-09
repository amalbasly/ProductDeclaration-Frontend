import { Component } from '@angular/core';
import { ValidateEmployeeService } from '../../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone : false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isOpen = false;
  isEmployeesMenuOpen = false;

  constructor(
    public ValidateEmployeeService: ValidateEmployeeService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  toggleEmployeesMenu(): void {
    this.isEmployeesMenuOpen = !this.isEmployeesMenuOpen;
  }

  logout(): void {
    this.ValidateEmployeeService.logout();
    this.router.navigate(['/login']);
  }
}