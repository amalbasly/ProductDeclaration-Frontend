import { Component, OnInit } from '@angular/core';
import { EmployeeService, PersonnelTracaDto } from '../../../Services/employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-list',
  standalone: false,
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
  userRole: 'admin' | 'rh' | null = null; // Initialize as null

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.detectUserRole();
    this.loadEmployees();
  }

  detectUserRole(): void {
    const urlSegment = this.route.snapshot.pathFromRoot
      .map(r => r.routeConfig?.path)
      .filter(path => !!path)
      .join('/');
    if (urlSegment.includes('admin')) {
      this.userRole = 'admin';
    } else if (urlSegment.includes('rh')) {
      this.userRole = 'rh';
    } else {
      this.userRole = 'rh'; // Default to rh if unclear, adjust as needed
    }
  }

  getBasePath(): string {
    return this.userRole === 'admin' ? '/admin' : '/rh';
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
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
        this.isLoading = false;
        console.error('Error loading employees:', err);
      }
    });
  }

  refresh(): void {
    this.loadEmployees();
  }

  deleteEmployee(employee: PersonnelTracaDto): void {
    if (!confirm(`Are you sure you want to delete ${employee.pl_prenom} ${employee.pl_nom}?`)) {
      return;
    }

    this.isLoading = true;

    this.employeeService.deleteEmployee({
      pl_matric: employee.pl_matric,
      pl_nom: employee.pl_nom,
      pl_prenom: employee.pl_prenom
    }).subscribe({
      next: () => {
        this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
        this.refresh();
      },
      error: (err) => {
        this.errorMessage = 'Error deleting employee, but refreshing list...';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
        console.error('Error deleting employee:', err);
        this.refresh();
      }
    });
  }

  openUpdateModal(employee: PersonnelTracaDto): void {
    this.closeModal();
    this.selectedEmployee = employee;
    this.newFunction = employee.pl_fonc || '';
    this.showUpdateModal = true;
  }

  openDetailsModal(employee: PersonnelTracaDto): void {
    this.closeModal();
    this.selectedEmployee = employee;
    this.showDetailsModal = true;
  }

  closeModal(): void {
    this.showUpdateModal = false;
    this.showDetailsModal = false;
    this.selectedEmployee = null;
    this.newFunction = '';
    this.errorMessage = null;
  }

  updateEmployeeFunction(): void {
    if (!this.selectedEmployee) {
      this.errorMessage = 'No employee selected';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
      return;
    }
    if (!this.newFunction.trim()) {
      this.errorMessage = 'Please enter a valid function';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.employeeService.updateEmployee(this.selectedEmployee.pl_matric, this.newFunction.trim())
      .subscribe({
        next: () => {
          this.snackBar.open('Employee function updated successfully', 'Close', { duration: 3000 });
          this.closeModal();
          this.refresh();
        },
        error: (err) => {
          this.errorMessage = 'Failed to update employee function. Please try again.';
          this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
          this.isLoading = false;
          console.error('Error updating employee:', err);
        }
      });
  }

  navigateToAddEmployee(): void {
    this.router.navigate([`${this.getBasePath()}/employees/add`]);
  }
}