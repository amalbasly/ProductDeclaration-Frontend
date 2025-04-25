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
      poids: [null, Validators.min(0)],
      createur: [''],
      dateCreation: [null],
      tolerance: [''],
      flashable: [null],
      isSerialized: [false] // Initialize with default value
    });
  }

  ngOnInit(): void {
    // Get the isSerialized flag from parent route data
    this.route.parent?.data.subscribe(data => {
        this.isSerializedRoute = data['isSerialized']; // Changed to bracket notation
        this.productForm.patchValue({ isSerialized: this.isSerializedRoute });
    });

    this.loadDropdownOptions();
}

  loadDropdownOptions(): void {
    this.isLoading = true;
    this.productService.getDropdownOptions().subscribe({
      next: (options: any) => {
        this.dropdowns = {
          lignes: options.lignes || [],
          famille: options.famille || [],
          sousFamilles: options.sousFamilles || [],
          types: options.types || [],
          statuts: options.statuts || []
        };
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading dropdown options:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.productForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.productForm.value;

    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.result === 'Success') {
          alert(`Product created successfully! Code: ${response.productCode}`);
          
          if (!this.isSerializedRoute) {
            this.productForm.reset();
            this.formSubmitted = false;
            // Reset isSerialized to the current route value
            this.productForm.patchValue({ isSerialized: this.isSerializedRoute });
          }
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
    if (this.productForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.productForm.value;

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
}