import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientReferenceService } from '../../../Services/client-reference.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reference-form',
  standalone : false,
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

  loadExistingReference(): void {
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
        alert(err.error);
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
        alert(err.error);
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
        alert(err.error);
      }
    });
  }
}