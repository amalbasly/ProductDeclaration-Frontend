import { Component, OnInit } from '@angular/core';
import { EmployeeService, PersonnelTracaDto } from '../../../Services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-dashboard',
  standalone : false,
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {
  employees: PersonnelTracaDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  isInitialLoad = true; // For flash prevention

  // Dashboard metrics
  totalEmployees = 0;
  growthRate = '5.2%';
  presentToday = 0;
  absentToday = 0;
  recentActivities: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.employeeService.getAllEmployees().subscribe({
      next: (data: PersonnelTracaDto[]) => {
        this.employees = data;
        this.totalEmployees = data.length;
        this.calculateMetrics();
        this.isLoading = false;
        
        // Prevent initial flash
        setTimeout(() => {
          this.isInitialLoad = false;
          document.body.classList.add('loaded');
        }, 50);
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
        console.error('Error loading dashboard:', err);
      }
    });
  }

  calculateMetrics(): void {
    this.presentToday = Math.floor(this.totalEmployees * 0.85);
    this.absentToday = this.totalEmployees - this.presentToday;
    
    this.recentActivities = [
      { 
        message: 'New employee added', 
        timestamp: new Date(Date.now() - 3600000),
        icon: 'fa-user-plus',
        color: 'primary'
      },
      { 
        message: 'Employee profile updated', 
        timestamp: new Date(Date.now() - 7200000),
        icon: 'fa-user-edit',
        color: 'info'
      },
      { 
        message: 'Monthly report generated', 
        timestamp: new Date(Date.now() - 86400000),
        icon: 'fa-file-alt',
        color: 'success'
      }
    ];
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/rh/employees/add']);
  }

  navigateToEmployeeList(): void {
    this.router.navigate(['/rh/employees/list']);
  }

  refresh(): void {
    this.loadDashboardData();
  }

  getFormattedDate(): string {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}