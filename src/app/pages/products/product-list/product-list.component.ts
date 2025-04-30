import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../Services/product.service';
import { ProduitSerialiséDto } from '../../../models/product';

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

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    const isSerialized = this.isSerializedFilter === '' ? undefined : this.isSerializedFilter === 'true';

    this.productService.getProducts(this.codeProduitFilter, this.statusFilter, isSerialized)
      .subscribe({
        next: (response: any) => {
          this.products = response.products || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load products';
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
      next: (response) => {
        if (response.result.toLowerCase() === 'success') {
          this.successMessage = `Product ${response.productCode} deleted successfully.`;
          // Refresh the product list
          this.getProducts();
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.error = 'Failed to delete product';
        console.error(err);
      }
    });
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