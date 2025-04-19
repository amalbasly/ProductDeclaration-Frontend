import { Component, Output, EventEmitter } from '@angular/core';
import { ValidateEmployeeService } from '../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone : false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() dashboardClicked    = new EventEmitter<void>();
  @Output() addEmployeeClicked  = new EventEmitter<void>();
  @Output() employeeListClicked = new EventEmitter<void>();

  isOpen = false;

  constructor(
    public authService: ValidateEmployeeService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  onDashboardClick(): void {
    this.dashboardClicked.emit();
  }

  onAddEmployeeClick(): void {
    this.addEmployeeClicked.emit();
  }

  onEmployeeListClick(): void {
    this.employeeListClicked.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
