import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateEmployeeService } from '../../Services/validate-employee.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private validateEmployeeService: ValidateEmployeeService,
    private router: Router
  ) {}

  onLogin() {
    this.errorMessage = '';
    
    if (!this.credentials) {
      this.errorMessage = 'Veuillez saisir vos informations';
      return;
    }

    const parts = this.credentials.trim().split(/\s+/).filter(part => part !== '');
    
    if (parts.length !== 3) {
      this.errorMessage = 'Format requis : Matricule Nom Prénom (3 valeurs séparées)';
      return;
    }

    const matricule = Number(parts[0]);
    if (isNaN(matricule)) {
      this.errorMessage = 'Le matricule doit être un nombre';
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
        if (result.accessStatus === 1) {
          // Store user data in the service
          this.validateEmployeeService.currentUser$.next(result);

          // Redirect based on role
          if (result.employeeFunction === 'RH') {
            this.router.navigate(['/profile-dashboard']);
          } else {
            this.router.navigate(['/default-dashboard']);
          }
        } else {
          this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 
                          'Erreur de connexion. Veuillez réessayer plus tard.';
      }
    });
  }
}