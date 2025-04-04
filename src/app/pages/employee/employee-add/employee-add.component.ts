import { Component, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from '../../../Services/employee.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-employee-add',
  standalone : false,
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent {
  @Output() successEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  employee = {
    pl_nom: '',
    pl_prenom: '',
    pl_badge: null as number | null,
    pl_fonc: '',
    img: '',
    descriptionGrp: ''
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private employeeService: EmployeeService) { }

  onSubmit(form: NgForm): void {
    if (form.valid && this.employee.pl_badge !== null) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const employeeData = {
        pl_nom: this.employee.pl_nom,
        pl_prenom: this.employee.pl_prenom,
        pl_badge: this.employee.pl_badge,
        pl_fonc: this.employee.pl_fonc,
        img: this.employee.img,
        descriptionGrp: this.employee.descriptionGrp
      };

      this.employeeService.addEmployee(employeeData).subscribe({
        next: (response: any) => {
          const matricule = response.pl_matric || response.matricule || 'N/A';
          this.successMessage = `Employee added successfully! Matricule: ${matricule}`;
          this.isLoading = false;
          
          setTimeout(() => {
            this.successEvent.emit();
          }, 2000);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.getErrorMessage(error);
          this.isLoading = false;
          console.error('Error adding employee:', error);
        }
      });
    } else {
      this.errorMessage = 'Please fill all required fields correctly';
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `An error occurred: ${error.error.message}`;
    } else {
      return error.error?.message || 
             error.message || 
             'Failed to add employee. Please try again.';
    }
  }

  resetForm(form: NgForm): void {
    form.resetForm();
    this.employee = {
      pl_nom: '',
      pl_prenom: '',
      pl_badge: null,
      pl_fonc: '',
      img: '',
      descriptionGrp: ''
    };
    this.successMessage = '';
    this.errorMessage = '';
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.employee.img = input.files[0].name;
    }
  }

  onCancel(): void {
    this.cancelEvent.emit();
  }
}