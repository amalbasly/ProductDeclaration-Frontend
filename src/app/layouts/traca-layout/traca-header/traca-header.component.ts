import { Component } from '@angular/core';
import { ValidateEmployeeService } from '../../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-traca-header',
  standalone: false,
  templateUrl: './traca-header.component.html',
  styleUrl: './traca-header.component.scss'
})
export class TracaHeaderComponent {
constructor(
    public authService: ValidateEmployeeService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
