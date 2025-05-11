import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientReferenceService } from '../../../Services/client-reference.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private refService: ClientReferenceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      clientReference: ['', Validators.required],
      clientIndex: ['', Validators.required],
      client: ['', Validators.required],
      referentiel: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productCode = params.get('productCode') || '';

      // Load existing reference if available
      if (this.productCode) {
        this.loadExistingReference();
      }
    });
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

      // Only alert for errors other than 404
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
        alert('Reference saved successfully!');
        this.router.navigate(['/prep/dashboard']);
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
        this.router.navigate(['/prep/products/create/non-serialized/justification', this.productCode]);
      },
      error: (err) => {
        this.isLoading = false;
        this.showError(err);
      }
    });
  }

  // ✅ Helper to show better error messages
  private showError(error: any): void {
    const message = error?.error?.message || error?.message || 'An unexpected error occurred';
    alert(message);
  }
}
