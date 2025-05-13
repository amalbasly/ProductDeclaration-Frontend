import { Component, OnInit } from '@angular/core';
import { GalliaService } from '../../../Services/gallia.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GalliaDto } from '../../../models/GalliaDto';
import QRCode from 'qrcode';

@Component({
  selector: 'app-gallia-list',
  standalone : false,
  templateUrl: './gallia-list.component.html',
  styleUrls: ['./gallia-list.component.scss']
})
export class GalliaListComponent implements OnInit {
  gallias: GalliaDto[] = [];
  qrCodes: { [key: number]: string } = {};
  isLoading = false;
  deletingIds: number[] = []; // Track which items are being deleted

  constructor(
    private galliaService: GalliaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGallias();
  }

  loadGallias(): void {
    this.isLoading = true;
    this.galliaService.getAllGallias().subscribe({
      next: (data) => {
        this.gallias = data;
        this.generateQRCodes();
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load Gallias. Please try again.', 'Close', { duration: 3000 });
        this.isLoading = false;
        console.error('Error loading Gallias:', err);
      }
    });
  }

  generateQRCodes(): void {
    this.gallias.forEach((gallia) => {
      QRCode.toDataURL(JSON.stringify(gallia))
        .then((url: string) => this.qrCodes[gallia.galliaId] = url)
        .catch(() => this.qrCodes[gallia.galliaId] = '');
    });
  }

  deleteGallia(id: number): void {
    if (confirm('Are you sure you want to delete this Gallia record?')) {
      this.deletingIds.push(id); // Mark this ID as being deleted
      
      this.galliaService.deleteGallia(id).subscribe({
        next: () => {
          // Remove from deletingIds array
          this.deletingIds = this.deletingIds.filter(i => i !== id);
          
          // Show success message
          this.snackBar.open('Gallia deleted successfully', 'Close', { duration: 3000 });
          
          // Refresh the list
          this.loadGallias();
        },
        error: (err) => {
          // Remove from deletingIds array
          this.deletingIds = this.deletingIds.filter(i => i !== id);
          
          // Show error message
          this.snackBar.open('Failed to delete Gallia. Please try again.', 'Close', { duration: 3000 });
          console.error('Error deleting Gallia:', err);
        }
      });
    }
  }

  isDeleting(id: number): boolean {
    return this.deletingIds.includes(id);
  }
}