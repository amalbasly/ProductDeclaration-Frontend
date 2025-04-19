import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../Services/product.service';

@Component({
  selector: 'app-product',
  standalone : false,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
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
      poids: [null],
      createur: [''],
      dateCreation: [null],
      tolerance: [''],
      flashable: [false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.productForm.invalid) {
      this.markAllAsTouched();
      alert('Please fill all required fields correctly');
      return;
    }

    this.isLoading = true;
    const formData = this.productForm.getRawValue();

    const productData = {
      ...formData,
      dateCreation: formData.dateCreation ? new Date(formData.dateCreation) : null,
      flashable: formData.flashable
    };

    this.productService.createProduct(productData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.Result === 'Success') {
          alert('Product created successfully!');
          this.resetForm();
        } else {
          alert(`Error: ${response.Message}`);
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert(`Error creating product: ${err.message}`);
      }
    });
  }

  private resetForm(): void {
    this.productForm.reset({
      ligne: '',
      famille: '',
      sousFamille: '',
      flashable: false
    });
    this.formSubmitted = false;
  }

  private markAllAsTouched(): void {
    Object.values(this.productForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}