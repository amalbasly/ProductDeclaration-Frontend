import { Component, OnInit } from '@angular/core';
import { ProductService, ProduitSerialiséDto } from '../../../Services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductJustificationDialogComponent } from '../product-justification-dialog/product-justification-dialog.component';

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
  userRole: 'prep' | 'admin' | 'traceabilityManager' | null = null;
  displayedColumns: string[] = [];
  managerId: string = 'manager-id'; // Replace with actual manager ID from auth service

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.detectUserRole();
    this.setDisplayedColumns();
    this.getProducts();
  }

  detectUserRole(): void {
    const urlSegment = this.route.snapshot.pathFromRoot
      .map(r => r.routeConfig?.path)
      .filter(path => !!path)
      .join('/');
    if (urlSegment.includes('admin')) {
      this.userRole = 'admin';
    } else if (urlSegment.includes('traca')) {
      this.userRole = 'traceabilityManager';
    } else {
      this.userRole = 'prep';
    }
  }

  setDisplayedColumns(): void {
    const baseColumns = [
      'actions',
      'ptNum',
      'ptLib',
      'fpCod',
      'spCod',
      'spId',
      'isSerialized',
      'ptPoids',
      'ptDcreat',
      'galliaName'
    ];
    this.displayedColumns = (this.userRole === 'admin' || this.userRole === 'traceabilityManager')
      ? [...baseColumns, 'isApproved']
      : baseColumns;
  }

  getBasePath(): string {
    switch (this.userRole) {
      case 'admin': return '/admin';
      case 'traceabilityManager': return '/traca';
      default: return '/prep';
    }
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
    const serviceMethod = (this.userRole === 'admin' || this.userRole === 'traceabilityManager')
      ? this.productService.getAllProducts
      : this.productService.getProducts;

    serviceMethod.call(this.productService, this.codeProduitFilter, this.statusFilter, isSerialized)
      .subscribe({
        next: (response: any) => {
          this.products = response.Products || response.products?.products || response.products || [];
          this.loading = false;
          if (this.products.length === 0) {
            this.error = 'No products found matching your criteria.';
          }
        },
        error: (err) => {
          this.error = 'Failed to load products: ' + (err.error?.Message || err.message);
          this.snackBar.open(this.error, 'Close', { duration: 3000 });
          console.error(err);
          this.loading = false;
        }
      });
  }

  onRowClick(product: ProduitSerialiséDto): void {
  if (this.userRole === 'traceabilityManager' && !product.IsApproved) {
    this.openJustificationDialog(product);
  }
}

openJustificationDialog(product: ProduitSerialiséDto): void {
  const dialogRef = this.dialog.open(ProductJustificationDialogComponent, {
    width: '600px',
    data: { 
      product: product,
      managerId: this.managerId 
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.getProducts(); // Refresh the list after approval/decline
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