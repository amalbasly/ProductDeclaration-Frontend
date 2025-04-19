import { Component } from '@angular/core';
import { EmployeeService, PersonnelTracaDto } from '../../Services/employee.service';

@Component({
  selector: 'app-profile-dashboard',
  standalone: false,
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent {
  employees: PersonnelTracaDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  userEmail = 'john.smith@example.com';
  totalEmployees = 0;
  growthRate = '5.2%';
  presentToday = 0; // Add these for dashboard metrics
  absentToday = 0;
  recentActivities: any[] = []; // Add for recent activity section

  showAddEmployeeForm = false;
  showEmployeeList = false; // Add this for employee list visibility

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDashboardData(); // Load additional dashboard data
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.employeeService.getAllEmployees().subscribe({
      next: (data: PersonnelTracaDto[]) => {
        this.employees = data;
        this.totalEmployees = data.length;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load employees. Please try again later.';
        this.isLoading = false;
        console.error('Error loading employees:', err);
      }
    });
  }

  loadDashboardData(): void {
    // Simulate loading dashboard data
    this.presentToday = Math.floor(this.totalEmployees * 0.85); // 85% present
    this.absentToday = this.totalEmployees - this.presentToday;
    
    // Sample recent activities
    this.recentActivities = [
      { message: 'New employee John Doe added', timestamp: new Date(Date.now() - 3600000) },
      { message: 'Employee profile updated', timestamp: new Date(Date.now() - 7200000) },
      { message: 'Monthly report generated', timestamp: new Date(Date.now() - 86400000) }
    ];
  }

  toggleAddEmployeeForm(show: boolean): void {
    this.showAddEmployeeForm = show;
    if (show) this.showEmployeeList = false; // Ensure only one is shown at a time
  }

  toggleEmployeeList(show: boolean): void {
    this.showEmployeeList = show;
    if (show) this.showAddEmployeeForm = false; // Ensure only one is shown at a time
    if (show) this.loadEmployees(); // Refresh data when showing list
  }

  onEmployeeAdded(): void {
    this.showAddEmployeeForm = false;
    this.loadEmployees();
    this.loadDashboardData(); // Refresh dashboard metrics
  }
  showDashboard() {
    this.showAddEmployeeForm  = false;
    this.showEmployeeList     = false;
  }

  refresh(): void {
    this.loadEmployees();
    this.loadDashboardData();
  }

  shouldShowDashboardContent(): boolean {
    return !this.showAddEmployeeForm && !this.showEmployeeList;
  }
}