import { Component } from '@angular/core';
import { EmployeeService, PersonnelTracaDto } from '../../Services/employee.service';

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

  showAddEmployeeForm = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
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

  toggleAddEmployeeForm(show: boolean): void {
    this.showAddEmployeeForm = show;
  }

  onEmployeeAdded(): void {
    this.showAddEmployeeForm = false;
    this.loadEmployees(); 
  }

  refresh(): void {
    this.loadEmployees();
  }

  shouldShowDashboardContent(): boolean {
    return !this.showAddEmployeeForm;
  }
}