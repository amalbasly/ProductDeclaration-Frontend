import { Component } from '@angular/core';
import { ValidateEmployeeService } from '../../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: false,
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
  constructor(
    public authService: ValidateEmployeeService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


