import { Component, OnInit, HostListener } from '@angular/core';
import { ValidateEmployeeService } from '../../../Services/validate-employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone : false,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isSidebarOpen = false;
  isMobile = window.innerWidth <= 768;

  constructor(public authService: ValidateEmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      console.log('Layout Component - Current User:', user);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}