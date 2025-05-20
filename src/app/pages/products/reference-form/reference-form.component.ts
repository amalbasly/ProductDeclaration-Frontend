import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientReferenceService } from '../../../Services/client-reference.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reference-form',
  standalone: false,
  templateUrl: './reference-form.component.html',
  styleUrls: ['./reference-form.component.scss']
})
export class ReferenceFormComponent implements OnInit {
  form: FormGroup;
  productCode: string = '';
  isLoading = false;
  isEditMode = false;
  userRole: 'admin' | 'prep' | null = null; // Initialize as null

  constructor(
    private fb: FormBuilder,
    private refService: ClientReferenceService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      clientReference: ['', Validators.required],
      clientIndex: ['', Validators.required],
      client: ['', Validators.required],
      referentiel: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.detectUserRole();
    this.route.paramMap.subscribe(params => {
      this.productCode = params.get('productCode') || '';

      if (this.productCode) {
        this.loadExistingReference();
      } else {
        this.snackBar.open('No product code provided', 'Close', { duration: 3000 });
        this.router.navigate([`${this.getBasePath()}/dashboard`]);
      }
    });
  }

  detectUserRole(): void {
    const urlSegment = this.route.snapshot.pathFromRoot
      .map(r => r.routeConfig?.path)
      .filter(path => !!path)
      .join('/');
    if (urlSegment.includes('admin')) {
      this.userRole = 'admin';
    } else if (urlSegment.includes('prep')) {
      this.userRole = 'prep';
    } else {
      this.userRole = 'prep'; // Default to prep if unclear, adjust as needed
    }
  }

  getBasePath(): string {
    return this.userRole === 'admin' ? '/admin' : '/prep';
  }

  private loadExistingReference(): void {
    this.isLoading = true;
    this.refService.getByPtNumAsync(this.productCode).subscribe({
      next: (reference) => {
        if (reference) {
          this.isEditMode = true;
          this.form.patchValue(reference);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status !== 404) {
          this.showError(err);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = {
      ptNum: this.productCode,
      ...this.form.value
    };

    this.isLoading = true;
    const operation = this.isEditMode
      ? this.refService.updateReference(this.productCode, formData)
      : this.refService.createReference(this.productCode, formData);

    operation.subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Reference saved successfully!', 'Close', { duration: 3000 });
        this.router.navigate([`${this.getBasePath()}/dashboard`]);
      },
      error: (err) => {
        this.isLoading = false;
        this.showError(err);
      }
    });
  }

  saveAndGoToJustification(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = {
      ptNum: this.productCode,
      ...this.form.value
    };

    this.isLoading = true;
    const operation = this.isEditMode
      ? this.refService.updateReference(this.productCode, formData)
      : this.refService.createReference(this.productCode, formData);

    operation.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate([`${this.getBasePath()}/products/create/non-serialized/justification`, this.productCode]);
      },
      error: (err) => {
        this.isLoading = false;
        this.showError(err);
      }
    });
  }

  private showError(error: any): void {
    const message = error?.error?.message || error?.message || 'An unexpected error occurred';
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}