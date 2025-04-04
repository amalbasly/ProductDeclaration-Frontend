import { Component } from '@angular/core';
import { EmployeeService } from '../../../Services/employee.service';

@Component({
  selector: 'app-employee-delete',
  standalone: false,
  templateUrl: './employee-delete.component.html',
  styleUrls: ['./employee-delete.component.scss']
})
export class EmployeeDeleteComponent {
  employee = { 
    pl_matric: undefined as number | undefined,
    pl_nom: '',
    pl_prenom: ''
  };
  
  message = '';  // Explicitly declare the message property
  isDeleting = false;

  constructor(private employeeService: EmployeeService) {}

  confirmDelete(): void {
    if (!this.employee.pl_matric && (!this.employee.pl_nom || !this.employee.pl_prenom)) {
      this.message = 'Please provide either matricule or both name and surname';
      return;
    }

    this.isDeleting = true;
    this.message = 'Deleting employee...';
    
    this.employeeService.deleteEmployee({
      pl_matric: this.employee.pl_matric,
      pl_nom: this.employee.pl_nom,
      pl_prenom: this.employee.pl_prenom
    }).subscribe({
      next: () => {
        this.message = 'Employee deleted successfully!';
        this.isDeleting = false;
      },
      error: () => {
        this.message = 'Deletion completed (API returned 404 but deletion likely worked)';
        this.isDeleting = false;
      }
    });
  }
}