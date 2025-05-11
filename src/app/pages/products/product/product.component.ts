import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../Services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduitSerialiséDto } from '../../../models/product';

@Component({
  selector: 'app-product',
  standalone: false,
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
  isUpdateMode = false;
  currentProduct: ProduitSerialiséDto | null = null;

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
    // Get route data (serialized/non-serialized)
    this.route.parent?.data.subscribe(data => {
      this.isSerializedRoute = data['isSerialized'] || false;
      this.productForm.patchValue({ isSerialized: this.isSerializedRoute });
    });

    // Check for product data in multiple ways (navigation state and history state)
    const navigation = this.router.getCurrentNavigation();
    const navState = navigation?.extras.state as {
      productData: ProduitSerialiséDto,
      isUpdateMode: boolean
    };

    const historyState = history.state as {
      productData: ProduitSerialiséDto,
      isUpdateMode: boolean
    };

    const state = navState || historyState;

    if (state?.productData) {
      this.isUpdateMode = true; // Force update mode when we have product data
      this.currentProduct = state.productData;
      this.loadProductData(this.currentProduct);
    }

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
        console.error('Error loading dropdown options:', error);
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

  loadProductData(product: ProduitSerialiséDto): void {
    // First reset the form to clear any previous values
    this.productForm.reset({
      isSerialized: this.isSerializedRoute
    });

    // Then patch all values including ligne
    this.productForm.patchValue({
      ligne: product.LpNum || '',
      famille: product.FpCod || '',
      sousFamille: product.SpCod || '',
      codeProduit: product.PtNum,
      libelle: product.PtLib || '',
      type: product.TpCod || '',
      libelle2: product.PtLib2 || '',
      statut: product.SpId || '',
      codeProduitClientC264: product.PtSpecifT14 || '',
      poids: product.PtPoids || null,
      createur: product.PtCreateur || '',
      dateCreation: product.PtDcreat || null,
      tolerance: product.PtSpecifT15 || '',
      flashable: product.PtFlasher || null,
      isSerialized: product.IsSerialized
    });

    if (this.isUpdateMode) {
      const codeControl = this.productForm.get('codeProduit');
      codeControl?.disable();
      codeControl?.setValue(product.PtNum);
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.productForm.invalid) return;

    this.isLoading = true;

    // Prepare form data - ensure we use the original product code for updates
    const formValue = this.productForm.getRawValue(); // Gets disabled values too
    const formData = {
      ...formValue,
      codeProduit: this.isUpdateMode ? this.currentProduct?.PtNum : formValue.codeProduit,
      isSerialized: this.isSerializedRoute
    };

    const operation = this.isUpdateMode
      ? this.productService.updateProduct({
          ...formData,
          pt_num: this.currentProduct?.PtNum // Explicitly pass the original product code
        })
      : this.productService.createProduct(formData);

    operation.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.result === 'Success') {
          const action = this.isUpdateMode ? 'updated' : 'created';
          alert(`Product ${action} successfully! Code: ${response.productCode}`);

          if (!this.isSerializedRoute && !this.isUpdateMode) {
            this.resetForm();
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        const action = this.isUpdateMode ? 'update' : 'create';
        alert(error.error?.message || `Failed to ${action} product`);
        console.error('Error:', error);
      }
    });
  }

  goToSynoptique(): void {
  this.formSubmitted = true;
  if (this.productForm.invalid) return;

  this.isLoading = true;
  const formData = {
    ...this.productForm.value,
    codeProduit: this.isUpdateMode ? this.currentProduct?.PtNum : this.productForm.value.codeProduit,
    isSerialized: this.productForm.value.isSerialized || false
  };

  const operation = this.isUpdateMode 
    ? this.productService.updateProduct({
        ...formData,
        pt_num: this.currentProduct?.PtNum
      })
    : this.productService.createProduct(formData);

  operation.subscribe({
    next: (response) => {
      this.isLoading = false;
      if (response.result === 'Success') {
        this.router.navigate(
          ['../synoptique', response.productCode], 
          { 
            relativeTo: this.route,
            queryParams: { update: this.isUpdateMode } 
          }
        );
      }
    },
    error: (error) => {
      this.isLoading = false;
      alert(error.error?.message || 'Failed to process product');
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
      codeProduit: this.isUpdateMode ? this.currentProduct?.PtNum : this.productForm.value.codeProduit,
      isSerialized: false // Explicitly set for non-serialized
    };

    const operation = this.isUpdateMode
      ? this.productService.updateProduct(formData)
      : this.productService.createProduct(formData);

    operation.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.result === 'Success') {
          this.router.navigate(['../', response.productCode, 'reference'], {
            relativeTo: this.route
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = typeof error.error === 'object'
          ? error.error.message || 'Failed to process product'
          : error.error || 'Failed to process product';
        alert(errorMessage);
      }
    });
  }
}