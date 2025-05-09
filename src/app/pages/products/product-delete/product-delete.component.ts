import { Component, ChangeDetectorRef } from '@angular/core';
import { ProductService , ProductResult} from '../../../Services/product.service';

@Component({
  selector: 'app-product-delete',
  standalone: false,
  templateUrl: './product-delete.component.html',
  styleUrls: ['./product-delete.component.scss']
})
export class ProductDeleteComponent {
  productCode = '';
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  deleteProduct(): void {
    const code = this.productCode.trim();
    if (!code) {
      this.error = 'Product code is required';
      this.successMessage = '';
      return;
    }
  
    this.loading = true;
    this.error = '';
    this.successMessage = '';
  
    this.productService.deleteProduct(code).subscribe({
      next: (response: ProductResult) => {
        this.loading = false;
        if (response.Result.toLowerCase() === 'success') {
          this.successMessage = `Product ${response.ProductCode} deleted successfully.`;
          this.productCode = '';
        } else {
          this.error = response.Message;
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'Failed to communicate with server.';
      }
    });
  }

  resetForm(): void {
    this.productCode = '';
    this.error = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }
}