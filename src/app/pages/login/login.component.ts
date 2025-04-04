import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ValidateEmployeeService } from '../../Services/validate-employee.service';

@Component({
  selector: 'app-login',
  standalone : false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private validateEmployeeService: ValidateEmployeeService,
    private router: Router
  ) {}

  onLogin(form: NgForm) {
    this.errorMessage = null;
    
    if (form.invalid) {
      this.errorMessage = 'Please enter valid credentials';
      return;
    }

    const parts = this.credentials.trim().split(/\s+/).filter(part => part !== '');
    
    if (parts.length !== 3) {
      this.errorMessage = 'Please enter: Matricule Nom Prenom (3 separate values)';
      return;
    }

    const matricule = Number(parts[0]);
    if (isNaN(matricule)) {
      this.errorMessage = 'Matricule must be a number';
      return;
    }

    this.isLoading = true;

    this.validateEmployeeService.validateEmployee(
      matricule, 
      parts[1], 
      parts[2]
    ).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result === 1) {
          this.router.navigate(['/profile-dashboard']);
        } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 
                          'Connection error. Please try again later.';
      }
    });
  }
}