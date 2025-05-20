import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../Services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduitSerialiséDto } from '../../../models/product';
import { forkJoin } from 'rxjs';
import { GalliaService } from '../../../Services/gallia.service';

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
    statuts: [] as string[],
    galliaNames: [] as string[]
  };
  isLoading = false;
  formSubmitted = false;
  isSerializedRoute = false;
  isUpdateMode = false;
  currentProduct: ProduitSerialiséDto | null = null;
  userRole: 'prep' | 'admin' | null = null; // Initialize as null

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private galliaService: GalliaService,
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
      isSerialized: [false],
      galliaName: ['']
    });
  }

  ngOnInit(): void {
    this.detectUserRole();
    this.route.parent?.data.subscribe(data => {
      this.isSerializedRoute = data['isSerialized'] || false;
      this.productForm.patchValue({ isSerialized: this.isSerializedRoute });
    });

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
      this.isUpdateMode = true;
      this.currentProduct = state.productData;
      this.loadProductData(this.currentProduct);
    }

    this.loadDropdownOptions();
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

  getCreateRoute(): string {
    const serializedPath = this.isSerializedRoute ? 'serialized' : 'non-serialized';
    return this.userRole === 'admin'
      ? `/admin/products/create/${serializedPath}`
      : `/prep/products/create/${serializedPath}`;
  }

  loadDropdownOptions(): void {
    this.isLoading = true;

    forkJoin({
      dropdowns: this.productService.getDropdownOptions(),
      galliaNames: this.galliaService.getGalliaNames()
    }).subscribe({
      next: ({ dropdowns, galliaNames }) => {
        this.dropdowns = {
          lignes: dropdowns.lignes?.filter(x => x) || [],
          famille: dropdowns.famille?.filter(x => x) || [],
          sousFamilles: dropdowns.sousFamilles?.filter(x => x) || [],
          types: dropdowns.types?.filter(x => x) || [],
          statuts: dropdowns.statuts?.filter(x => x) || [],
          galliaNames: galliaNames || []
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
          statuts: [],
          galliaNames: []
        };
      }
    });
  }

  loadProductData(product: ProduitSerialiséDto): void {
    this.productForm.reset({
      isSerialized: this.isSerializedRoute
    });

    this.productForm.patchValue({
      ligne: product.LpNum || product.LpNum || '',
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
      isSerialized: product.IsSerialized,
      galliaName: product.GalliaName || product.GalliaName || ''
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
    const formValue = this.productForm.getRawValue();
    const formData = {
      ...formValue,
      codeProduit: this.isUpdateMode ? this.currentProduct?.PtNum : formValue.codeProduit,
      isSerialized: this.isSerializedRoute
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
          const action = this.isUpdateMode ? 'updated' : 'created';
          alert(`Product ${action} successfully! Code: ${response.productCode}`);
          if (!this.isUpdateMode) {
            this.router.navigate([this.getCreateRoute()]); // Navigate to create route
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        const action = this.isUpdateMode ? 'update' : 'create';
        alert(error.error?.message || `Failed to ${action} product`);
      }
    });
  }

  goToSynoptique(): void {
    this.formSubmitted = true;
    if (this.productForm.invalid) return;

    this.isLoading = true;
    const formValue = this.productForm.getRawValue();
    const formData = {
      ...formValue,
      codeProduit: this.isUpdateMode ? this.currentProduct?.PtNum : formValue.codeProduit,
      isSerialized: this.isSerializedRoute
    };

    const operation = this.isUpdateMode
      ? this.productService.updateProduct({ ...formData, pt_num: this.currentProduct?.PtNum })
      : this.productService.createProduct(formData);

    operation.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.result === 'Success') {
          const basePath = this.userRole === 'admin' ? '/admin' : '/prep';
          this.router.navigate(
            [`${basePath}/products/create/serialized/synoptique`, response.productCode],
            { queryParams: { update: this.isUpdateMode } }
          );
        }
      },
      error: (error) => {
        this.isLoading = false;
        alert(error.error?.message || 'Failed to process product');
      }
    });
  }

  goToReference(): void {
    this.formSubmitted = true;
    if (this.productForm.invalid) return;

    this.isLoading = true;
    const formValue = this.productForm.getRawValue();
    const formData = {
      ...formValue,
      codeProduit: this.isUpdateMode ? this.currentProduct?.PtNum : formValue.codeProduit,
      isSerialized: false
    };

    const operation = this.isUpdateMode
      ? this.productService.updateProduct(formData)
      : this.productService.createProduct(formData);

    operation.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.result === 'Success') {
          const basePath = this.userRole === 'admin' ? '/admin' : '/prep';
          this.router.navigate(
            [`${basePath}/products/create/non-serialized`, response.productCode, 'reference']
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
    this.productForm.reset();
    this.formSubmitted = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!control && control.invalid && (control.touched || this.formSubmitted);
  }
}