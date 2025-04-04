import { Component, OnInit } from '@angular/core';
import { EmployeeService, PersonnelTracaDto } from '../../../Services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: PersonnelTracaDto[] = [];  // Changed to array to hold multiple employees
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.employeeService.getAllEmployees().subscribe({
      next: (data: PersonnelTracaDto[]) => {  // Added proper next handler
        this.employees = data;  // Assign to array
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load employees. Please try again later.';
        this.isLoading = false;
        console.error('Error loading employees:', err);
      }
    });
  }

  refresh(): void {
    this.loadEmployees();
  }
}