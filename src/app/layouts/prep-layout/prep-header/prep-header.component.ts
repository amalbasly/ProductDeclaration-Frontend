import { Component } from '@angular/core';
import { ValidateEmployeeService } from '../../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prep-header',
  standalone: false,
  templateUrl: './prep-header.component.html',
  styleUrls: ['./prep-header.component.scss'],
})
export class PrepHeaderComponent {
  constructor(
    public authService: ValidateEmployeeService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}