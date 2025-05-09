import { Component, OnInit } from '@angular/core';
import { GalliaService } from '../../../Services/gallia.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GalliaDto } from '../../../models/GalliaDto';
import QRCode from 'qrcode'; // Import the correct QR code generator


@Component({
  selector: 'app-gallia-list',
  standalone: false,
  templateUrl: './gallia-list.component.html',
  styleUrls: ['./gallia-list.component.scss']
})
export class GalliaListComponent implements OnInit {
  gallias: GalliaDto[] = [];
  isLoading = false;
  errorMessage = '';
  qrCodes: { [key: number]: string } = {}; // Map of Gallia IDs to QR code URLs

  constructor(
    private galliaService: GalliaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGallias();
  }

  loadGallias(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.galliaService.getAllGallias().subscribe({
      next: (data) => {
        this.gallias = data;
        this.generateQRCodes(); // Generate QR codes after loading data
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load Gallias.';
        this.isLoading = false;
        console.error('Error loading Gallias:', err);
      }
    });
  }

  generateQRCodes(): void {
    this.gallias.forEach((gallia) => {
      // Generate QR code from Gallia object
      QRCode.toDataURL(JSON.stringify(gallia))
        .then((url: string) => {  // Explicitly type 'url' as string
          // Store the generated QR code URL
          this.qrCodes[gallia.galliaId] = url;
        })
        .catch((err: any) => {  // Explicitly type 'err' as any for errors
          console.error('Error generating QR code:', err);
        });
    });
  }
  

  deleteGallia(id: number): void {
    if (confirm('Are you sure you want to delete this Gallia?')) {
      this.isLoading = true;
      this.galliaService.deleteGallia(id).subscribe({
        next: () => {
          this.snackBar.open('Gallia deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadGallias();
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Failed to delete Gallia.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Error deleting Gallia:', err);
        }
      });
    }
  }
}
