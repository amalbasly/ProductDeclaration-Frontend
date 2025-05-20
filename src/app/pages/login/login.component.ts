import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateEmployeeService, User } from '../../Services/validate-employee.service';

@Component({
  selector: 'app-login',
  standalone : false,
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
      next: (result: User | null) => {  // Now using User interface from service
        this.isLoading = false;
        
        if (!result) {
          this.errorMessage = 'Réponse invalide du serveur';
          return;
        }

        if (result.accessStatus === 1) {
          this.validateEmployeeService.currentUser$.next(result);

          if (result.employeeFunction === 'RH') {
            this.router.navigate(['/rh']); // Use the base RH route
          } else if (result.employeeFunction =='préparateur') {
            this.router.navigate(['/prep']);
          } 
          else if (result.employeeFunction === 'Admin'){
            this.router.navigate(['/admin']);
          }
          }
         else {
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