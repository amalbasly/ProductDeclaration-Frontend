import { Component } from '@angular/core';
import { GalliaService } from '../../../Services/gallia.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateGalliaDto } from '../../../models/GalliaDto';

@Component({
  selector: 'app-gallia-create',
  standalone : false,
  templateUrl: './gallia-create.component.html',
  styleUrls: ['./gallia-create.component.scss']
})
export class GalliaCreateComponent {
  gallia: CreateGalliaDto = {
    visualizationType: 'qrcode' // Default to QR Code
  };
  isLoading = false;
  desiredFieldCount = 4;
  fieldsCount: number | null = null;
  dynamicFields: number[] = [];
  
  // Visualization options for dropdown
  visualizationOptions = [
    { value: 'qrcode', label: 'QR Code' },
    { value: 'barcode', label: 'Barcode' },
    { value: 'datametrics', label: 'Data Metrics' }
  ];

  constructor(
    private galliaService: GalliaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}


  setFieldsCount(): void {
    if (this.desiredFieldCount > 0 && this.desiredFieldCount <= 20) {
      this.fieldsCount = this.desiredFieldCount;
      this.dynamicFields = Array(this.fieldsCount).fill(0).map((x, i) => i);
    }
  }

  incrementCount(): void {
    if (this.desiredFieldCount < 20) {
      this.desiredFieldCount++;
    }
  }

  decrementCount(): void {
    if (this.desiredFieldCount > 1) {
      this.desiredFieldCount--;
    }
  }

  resetForm(): void {
    this.fieldsCount = null;
    this.gallia = {};
    this.desiredFieldCount = 4;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.galliaService.createGallia(this.gallia).subscribe({
      next: (createdGallia) => {
        this.isLoading = false;
        this.snackBar.open('Gallia created successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/prep/gallia']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Failed to create Gallia', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error creating Gallia:', err);
      }
    });
  }
}