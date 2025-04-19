import { Component, OnInit } from '@angular/core';
import { EmployeeService, PersonnelTracaDto } from '../../../Services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone : false,
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: PersonnelTracaDto[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  
  showUpdateModal = false;
  showDetailsModal = false;
  selectedEmployee: PersonnelTracaDto | null = null;
  newFunction = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load employees. Please try again later.';
        this.isLoading = false;
        console.error('Error loading employees:', err);
      }
    });
  }

  refresh(): void {
    this.loadEmployees();
  }

  deleteEmployee(employee: PersonnelTracaDto): void {
    if (confirm(`Are you sure you want to delete ${employee.pl_prenom} ${employee.pl_nom}?`)) {
      this.isLoading = true;
      
      this.employeeService.deleteEmployee({
        pl_matric: employee.pl_matric,
        pl_nom: employee.pl_nom,
        pl_prenom: employee.pl_prenom
      }).subscribe({
        next: () => {
          this.refresh();
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          this.errorMessage = 'Error deleting employee, but refreshing list...';
          this.refresh();
        }
      });
    }
  }

  openUpdateModal(employee: PersonnelTracaDto): void {
    this.selectedEmployee = employee;
    this.newFunction = employee.pl_fonc || '';
    this.showUpdateModal = true;
  }

  openDetailsModal(employee: PersonnelTracaDto): void {
    this.selectedEmployee = employee;
    this.showDetailsModal = true;
  }

  closeModal(): void {
    this.showUpdateModal = false;
    this.showDetailsModal = false;
    this.selectedEmployee = null;
    this.newFunction = '';
  }

  updateEmployeeFunction(): void {
    if (!this.selectedEmployee || !this.newFunction) {
      this.errorMessage = 'Please enter a function';
      return;
    }

    this.isLoading = true;
    this.employeeService.updateEmployee(this.selectedEmployee.pl_matric, this.newFunction)
      .subscribe({
        next: () => {
          this.closeModal();
          this.refresh();
        },
        error: (err) => {
          this.errorMessage = 'Failed to update employee function';
          this.isLoading = false;
          console.error('Error updating employee:', err);
        }
      });
  }
}