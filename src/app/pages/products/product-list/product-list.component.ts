import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../Services/product.service';
import { ProduitSerialiséDto } from '../../../models/product';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-product-list',
  standalone : false,
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

  constructor(private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.products = [];

    const isSerialized = this.isSerializedFilter === '' ? undefined : this.isSerializedFilter === 'true';

    this.productService.getProducts(this.codeProduitFilter, this.statusFilter, isSerialized)
      .subscribe({
        next: (response: any) => {
          // Handle both possible response structures
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
          console.error(err);
          this.loading = false;
        }
      });
  }

  deleteProduct(productCode: string) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.productService.deleteProduct(productCode).subscribe({
      next: (response: any) => {
        if (response.Result?.toLowerCase() === 'success' || response.result?.toLowerCase() === 'success') {
          this.successMessage = `Product ${response.ProductCode || response.productCode} deleted successfully.`;
          this.getProducts();
        } else {
          this.error = response.Message || response.message || 'Failed to delete product';
        }
      },
      error: (err) => {
        this.error = 'Failed to delete product: ' + (err.error?.Message || err.error?.message || err.message);
        console.error(err);
      }
    });
  }
 onUpdateProduct(product: ProduitSerialiséDto): void {
  // Determine the correct base path based on product type
  const basePath = product.IsSerialized ? 'serialized' : 'non-serialized';
  
  // Navigate to the product form with state
  this.router.navigate(
    ['/prep/products/create', basePath, 'product'],
    {
      state: {
        productData: product,
        isUpdateMode: true
      }
    }
  );
}
  

  onSearch() {
    this.getProducts();
  }

  onClearFilters() {
    this.codeProduitFilter = '';
    this.statusFilter = '';
    this.isSerializedFilter = '';
    this.getProducts();
  }
}