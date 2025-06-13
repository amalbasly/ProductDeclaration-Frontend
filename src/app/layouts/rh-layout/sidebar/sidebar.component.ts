import { Component } from '@angular/core';
import { ValidateEmployeeService } from '../../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isOpen = false;

  // Sidebar Menu States
  isEmployeesMenuOpen = false;
  isRecruitmentMenuOpen = false;
  isPayrollMenuOpen = false;

  constructor(
    public ValidateEmployeeService: ValidateEmployeeService,
    private router: Router
  ) {}

  // Toggle sidebar open/close (for mobile)
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  // Toggle submenu states
  toggleEmployeesMenu(): void {
    this.isEmployeesMenuOpen = !this.isEmployeesMenuOpen;
  }

  toggleRecruitmentMenu(): void {
    this.isRecruitmentMenuOpen = !this.isRecruitmentMenuOpen;
  }

  togglePayrollMenu(): void {
    this.isPayrollMenuOpen = !this.isPayrollMenuOpen;
  }

  // Logout function
  logout(): void {
    this.ValidateEmployeeService.logout();
    this.router.navigate(['/login']);
  }
}