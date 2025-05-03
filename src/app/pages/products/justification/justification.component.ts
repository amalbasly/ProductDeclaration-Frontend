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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private justificationService: JustificationService
  ) {}

  ngOnInit(): void {
    // Get product code from route parameter
    this.productCode = this.route.snapshot.paramMap.get('ptNum') || '';

    if (!this.productCode) {
      this.errorMessage = 'No product code provided';
      alert(this.errorMessage);
      this.router.navigate(['/prep/dashboard']);
    }
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  submitJustification(): void {
    if (!this.justificationText || this.justificationText.length < 10) {
      alert('Justification must be at least 10 characters.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const submittedBy = 'system_user';

    this.justificationService.submitJustification({
      productCode: this.productCode,
      justificationText: this.justificationText,
      urgencyLevel: this.urgencyLevel,
      submittedBy: submittedBy
    }).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        alert('Justification submitted successfully!');
        this.router.navigate(['/prep/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.handleError(error);
        alert(this.errorMessage || 'Failed to submit justification. Please try again.');
        this.router.navigate(['/prep/dashboard']);
      }
    });
  }

  private handleError(error: any): void {
    if (error.error) {
      this.errorMessage = error.error.details || error.error.message || 'Submission failed';
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    }
    console.error('Justification submission error:', error);
  }
}
