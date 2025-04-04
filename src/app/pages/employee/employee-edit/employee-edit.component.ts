import { Component } from '@angular/core';
import { EmployeeService } from '../../../Services/employee.service';

@Component({
  selector: 'app-employee-edit',
  standalone : false,
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent {
  pl_matric: number | null = null;
  pl_fonc: string = '';
  isLoading = false;
  message: string = '';
  isError: boolean = false;

  constructor(private employeeService: EmployeeService) {}

  updateEmployee(): void {
    if (!this.pl_matric || !this.pl_fonc) {
      this.message = 'Please enter both matricule and function';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.isError = false;

    this.employeeService.updateEmployee(this.pl_matric, this.pl_fonc).subscribe({
      next: () => {
        this.message = 'Employee function updated successfully!';
        this.isLoading = false;
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to update employee function';
        this.isError = true;
        this.isLoading = false;
      }
    });
  }
}