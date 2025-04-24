import { Component } from '@angular/core';
import { ValidateEmployeeService } from '../../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone :false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  showDropdown = false;
  notifications = [
    { id: 1, text: 'New employee joined', time: '2h ago' },
    { id: 2, text: 'System update available', time: '1d ago' }
  ];

  constructor(
    public auth: ValidateEmployeeService,
    private router: Router
  ) {}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}