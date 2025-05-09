import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../Services/product.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone : false,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  dropdowns = {
    lignes: [] as string[],
    famille: [] as string[],
    sousFamilles: [] as string[],
    types: [] as string[],
    statuts: [] as string[]
  };
  isLoading = false;
  formSubmitted = false;
  isSerializedRoute = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      ligne: ['', Validators.required],
      famille: ['', Validators.required],
      sousFamille: ['', Validators.required],
      codeProduit: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      libelle: ['', Validators.required],
      type: [''],
      libelle2: [''],
      statut: [''],
      codeProduitClientC264: [''],
      poids: [null, [Validators.min(0)]],
      createur: [''],
      dateCreation: [null],
      tolerance: [''],
      flashable: [null],
      isSerialized: [false]
    });
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.isSerializedRoute = data['isSerialized'] || false;
      this.productForm.patchValue({ isSerialized: this.isSerializedRoute });
    });
    this.loadDropdownOptions();
  }

  loadDropdownOptions(): void {
    this.isLoading = true;
    this.productService.getDropdownOptions().subscribe({
      next: (response) => {
        this.dropdowns = {
          lignes: response.lignes?.filter(x => x) || [],
          famille: response.famille?.filter(x => x) || [],
          sousFamilles: response.sousFamilles?.filter(x => x) || [],
          types: response.types?.filter(x => x) || [],
          statuts: response.statuts?.filter(x => x) || []
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading options:', error);
        this.isLoading = false;
        this.dropdowns = {
          lignes: [],
          famille: [],
          sousFamilles: [],
          types: [],
          statuts: []
        };
      }
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.productForm.invalid) return;
  
    this.isLoading = true;
    // Ensure isSerialized has a value
    const formData = {
      ...this.productForm.value,
      isSerialized: this.productForm.value.isSerialized || false
    };
  
    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.result === 'Success') {
          alert(`Product created successfully! Code: ${response.productCode}`);
          if (!this.isSerializedRoute) this.resetForm();
        }
      },
      error: (error) => {
        this.isLoading = false;
        alert(error.error?.message || 'Failed to create product');
      }
    });
  }
  
  goToSynoptique(): void {
    this.formSubmitted = true;
    if (this.productForm.invalid) return;
  
    this.isLoading = true;
    const formData = {
      ...this.productForm.value,
      isSerialized: this.productForm.value.isSerialized || false
    };
  
    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.result === 'Success') {
          this.router.navigate(['../synoptique', response.productCode], { 
            relativeTo: this.route 
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        alert(error.error?.message || 'Failed to create product');
      }
    });
  }

  private resetForm(): void {
    this.productForm.reset({
      isSerialized: this.isSerializedRoute
    });
    this.formSubmitted = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!control && control.invalid && (control.touched || this.formSubmitted);
  }
  goToReference(): void {
  this.formSubmitted = true;
  if (this.productForm.invalid) return;

  this.isLoading = true;
  const formData = {
    ...this.productForm.value,
    isSerialized: false // Explicitly set for non-serialized
  };

  this.productService.createProduct(formData).subscribe({
    next: (response) => {
      this.isLoading = false;
      if (response.result === 'Success') {
        this.router.navigate(['../', response.productCode, 'reference'], { 
          relativeTo: this.route
        });
      } else {
        // Only show alert if there's an issue with navigation
        alert(response.message || 'Product created but unable to navigate to reference');
      }
    },
    error: (error) => {
      this.isLoading = false;
      const errorMessage = typeof error.error === 'object' 
        ? error.error.message || 'Failed to create product'
        : error.error || 'Failed to create product';
      alert(errorMessage);
    }
  });
}
}
