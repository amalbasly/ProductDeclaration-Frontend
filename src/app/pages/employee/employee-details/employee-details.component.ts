import { Component, OnInit } from '@angular/core';
import { EmployeeService, PersonnelTracaDto } from '../../../Services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  standalone: false,
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  employee: PersonnelTracaDto | null = null;
  isLoading = false;
  error: string | null = null;
  searchMatricule: string = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check for matricule in route parameters
    const matriculeParam = this.route.snapshot.paramMap.get('matricule');
    if (matriculeParam) {
      this.searchMatricule = matriculeParam;
      this.searchEmployee();
    }
  }

  searchEmployee(): void {
    const matricule = Number(this.searchMatricule);
    if (isNaN(matricule)) {
      this.error = 'Please enter a valid matricule number';
      this.employee = null;
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.employee = null;

    this.employeeService.getEmployeeDetails(matricule).subscribe({
      next: (data) => {
        this.employee = data;
        this.isLoading = false;
        // Update the URL without reloading the component
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { matricule: this.searchMatricule },
          queryParamsHandling: 'merge'
        });
      },
      error: (err) => {
        this.error = 'Employee not found or error loading details';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}