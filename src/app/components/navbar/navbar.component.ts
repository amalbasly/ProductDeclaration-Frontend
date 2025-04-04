// navbar.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { ValidateEmployeeService } from '../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone : false ,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() addEmployeeClicked = new EventEmitter<void>();

  constructor(
    public authService: ValidateEmployeeService,
    private router: Router
  ) {}

  onAddEmployeeClick(): void {
    this.addEmployeeClicked.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}