import { Component } from '@angular/core';
import { GalliaService } from '../../../Services/gallia.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UpdateGalliaDto } from '../../../models/GalliaDto';
import { GalliaDto } from '../../../models/GalliaDto';

@Component({
  selector: 'app-gallia-update',
  standalone : false,
  templateUrl: './gallia-update.component.html',
  styleUrls: ['./gallia-update.component.scss']
})
export class GalliaUpdateComponent {
  galliaIdInput: number | null = null;
  gallia: UpdateGalliaDto | null = null;
  isLoading = false;
  isSearching = false;
  hasError = false;

  constructor(
    private galliaService: GalliaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onSearch(): void {
    if (!this.galliaIdInput) {
      this.snackBar.open('Please enter a valid Gallia ID', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isSearching = true;
    this.hasError = false;
    
    this.galliaService.getGalliaById(this.galliaIdInput).subscribe({
      next: (gallia: GalliaDto) => {
        this.gallia = {
          GalliaId: gallia.galliaId,
          PLIB1: gallia.pliB1,
          QLIB3: gallia.qliB3,
          LIB1: gallia.liB1,
          LIB2: gallia.liB2,
          LIB3: gallia.liB3,
          LIB4: gallia.liB4,
          LIB5: gallia.liB5,
          LIB6: gallia.liB6,
          LIB7: gallia.liB7,
          SupplierName: gallia.supplierName,
          LabelDate: gallia.labelDate ? new Date(gallia.labelDate) : null
        };
        this.isSearching = false;
      },
      error: (err) => {
        this.hasError = true;
        this.gallia = null;
        this.isSearching = false;
        this.snackBar.open('Gallia not found', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error loading Gallia:', err);
      }
    });
  }

  onSubmit(): void {
    if (!this.gallia) return;

    this.isLoading = true;
    this.galliaService.updateGallia(this.gallia).subscribe({
      next: () => {
        this.snackBar.open('Gallia updated successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/gallia']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Failed to update Gallia', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error updating Gallia:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/gallia']);
  }

  onNewSearch(): void {
    this.gallia = null;
    this.galliaIdInput = null;
    this.hasError = false;
  }
}