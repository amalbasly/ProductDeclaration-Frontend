import { Component } from '@angular/core';
import { EmployeeService, PersonnelTracaDto } from '../../../Services/employee.service';

@Component({
  selector: 'app-profile-dashboard',
  standalone : false,
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
  presentToday = 0;
  absentToday = 0;
  recentActivities: any[] = [];

  showAddEmployeeForm = false;
  showEmployeeList = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDashboardData();
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
    this.presentToday = Math.floor(this.totalEmployees * 0.85);
    this.absentToday = this.totalEmployees - this.presentToday;
    
    this.recentActivities = [
      { message: 'New employee John Doe added', timestamp: new Date(Date.now() - 3600000) },
      { message: 'Employee profile updated', timestamp: new Date(Date.now() - 7200000) },
      { message: 'Monthly report generated', timestamp: new Date(Date.now() - 86400000) }
    ];
  }

  toggleAddEmployeeForm(show: boolean): void {
    this.showAddEmployeeForm = show;
    if (show) this.showEmployeeList = false;
  }

  toggleEmployeeList(show: boolean): void {
    this.showEmployeeList = show;
    if (show) this.showAddEmployeeForm = false;
    if (show) this.loadEmployees();
  }

  onEmployeeAdded(): void {
    this.showAddEmployeeForm = false;
    this.loadEmployees();
    this.loadDashboardData();
  }

  showDashboard() {
    this.showAddEmployeeForm = false;
    this.showEmployeeList = false;
  }

  refresh(): void {
    this.loadEmployees();
    this.loadDashboardData();
  }

  shouldShowDashboardContent(): boolean {
    return !this.showAddEmployeeForm && !this.showEmployeeList;
  }
}