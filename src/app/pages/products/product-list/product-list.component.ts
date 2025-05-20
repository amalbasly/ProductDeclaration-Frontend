import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../Services/product.service';
import { ProduitSerialiséDto } from '../../../models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: ProduitSerialiséDto[] = [];
  codeProduitFilter: string = '';
  statusFilter: string = '';
  isSerializedFilter: string = '';
  loading = false;
  error = '';
  successMessage = '';
  userRole: 'prep' | 'admin' | null = null; // Initialize as null

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar // Added for consistent feedback
  ) {}

  ngOnInit(): void {
    this.detectUserRole();
    this.getProducts();
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

  getCreateRoute(isSerialized: boolean): string {
    const basePath = isSerialized ? 'serialized' : 'non-serialized';
    return `${this.getBasePath()}/products/create/${basePath}/product`;
  }

  getProducts(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.products = [];

    const isSerialized = this.isSerializedFilter === '' ? undefined : this.isSerializedFilter === 'true';

    this.productService.getProducts(this.codeProduitFilter, this.statusFilter, isSerialized)
      .subscribe({
        next: (response: any) => {
          if (response.products?.products) {
            this.products = response.products.products;
          } else if (response.Products) {
            this.products = response.Products;
          } else if (response.products) {
            this.products = response.products;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load products: ' + (err.error?.message || err.message);
          this.snackBar.open(this.error, 'Close', { duration: 3000 });
          console.error(err);
          this.loading = false;
        }
      });
  }

  deleteProduct(productCode: string): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.productService.deleteProduct(productCode).subscribe({
      next: (response: any) => {
        if (response.Result?.toLowerCase() === 'success' || response.result?.toLowerCase() === 'success') {
          this.successMessage = `Product ${response.ProductCode || response.productCode} deleted successfully.`;
          this.snackBar.open(this.successMessage, 'Close', { duration: 3000 });
          this.getProducts();
        } else {
          this.error = response.Message || response.message || 'Failed to delete product';
          this.snackBar.open(this.error, 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.error = 'Failed to delete product: ' + (err.error?.Message || err.error?.message || err.message);
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  onUpdateProduct(product: ProduitSerialiséDto): void {
    const basePath = product.IsSerialized ? 'serialized' : 'non-serialized';
    this.router.navigate(
      [`${this.getBasePath()}/products/create/${basePath}/product`],
      {
        state: {
          productData: product,
          isUpdateMode: true
        }
      }
    );
  }

  onSearch(): void {
    this.getProducts();
  }

  onClearFilters(): void {
    this.codeProduitFilter = '';
    this.statusFilter = '';
    this.isSerializedFilter = '';
    this.getProducts();
  }
}