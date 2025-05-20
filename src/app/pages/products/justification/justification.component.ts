import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JustificationService } from '../../../Services/justification.service';

@Component({
  selector: 'app-justification',
  standalone: false,
  templateUrl: './justification.component.html',
  styleUrls: ['./justification.component.scss']
})
export class JustificationComponent implements OnInit {
  productCode: string = '';
  justificationText: string = '';
  urgencyLevel: string = 'Medium';
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  userRole: 'prep' | 'admin' | null = null; // Initialize as null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private justificationService: JustificationService
  ) {}

  ngOnInit(): void {
    this.detectUserRole();
    this.productCode = this.route.snapshot.paramMap.get('ptNum') || '';
    
    if (!this.productCode) {
      this.errorMessage = 'No product code provided';
      alert(this.errorMessage);
      this.router.navigate([`${this.getBasePath()}/dashboard`]);
    }
  }

  detectUserRole(): void {
    const urlSegment = this.route.snapshot.pathFromRoot
      .map(r => r.routeConfig?.path)
      .filter(path => !!path)
      .join('/');
    if (urlSegment.includes('admin')) {
      this.userRole = 'admin';
    } else {
      this.userRole = 'prep';
    }
  }

  getBasePath(): string {
    return this.userRole === 'admin' ? '/admin' : '/prep';
  }

  navigateToProducts(): void {
    // Navigate to product list, which is '/list' for prep and '/list' for admin
    this.router.navigate([`${this.getBasePath()}/list`]);
  }

  submitJustification(): void {
    if (!this.justificationText || this.justificationText.length < 10) {
      this.errorMessage = 'Please enter at least 10 characters for your justification.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const submittedBy = 'system_user'; // Placeholder, replace with authService user ID when available

    this.justificationService.submitJustification({
      productCode: this.productCode,
      justificationText: this.justificationText,
      urgencyLevel: this.urgencyLevel,
      submittedBy
    }).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        alert('Justification submitted successfully!');
        this.router.navigate([`${this.getBasePath()}/dashboard`]);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.handleError(error);
        alert(this.errorMessage || 'Failed to submit justification. Please try again.');
        this.router.navigate([`${this.getBasePath()}/dashboard`]);
      }
    });
  }

  private handleError(error: any): void {
    this.errorMessage = error?.error?.details || error?.error?.message || 'Submission failed';
    console.error('Justification submission error:', error);
  }
}