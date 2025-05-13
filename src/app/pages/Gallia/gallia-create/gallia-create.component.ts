import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GalliaService } from '../../../Services/gallia.service';
import { CreateGalliaDto, CreateGalliaFieldDto, GalliaDto, LabelImageDto } from '../../../models/GalliaDto';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-gallia-create',
  standalone: false,
  templateUrl: './gallia-create.component.html',
  styleUrls: ['./gallia-create.component.scss']
})
export class GalliaCreateComponent {
  gallia: CreateGalliaDto = {
    labelDate: null,
    fields: []
  };

  desiredFieldCount = 4;
  previews: { [key: number]: string } = {};
  isLoading = false;

  visualizationOptions = [
    { value: 'qrcode', label: 'QR Code' },
    { value: 'barcode', label: 'Barcode' },
    { value: 'datametrics', label: 'Text' },
    { value: 'number', label: 'Number' }
  ];

  constructor(
    private galliaService: GalliaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  setFieldsCount(): void {
    console.log('Setting fields count:', this.desiredFieldCount);
    
    if (this.desiredFieldCount < 1 || this.desiredFieldCount > 20) {
      this.snackBar.open('Please choose between 1 and 20 fields.', 'Close', { duration: 3000 });
      return;
    }

    this.gallia.fields = [];
    
    for (let i = 0; i < this.desiredFieldCount; i++) {
      this.gallia.fields.push({
        fieldValue: '',
        displayOrder: i + 1,
        visualizationType: 'qrcode',
        fieldName: `Field ${i + 1}`
      });
    }

    console.log('Fields created:', this.gallia.fields);
    this.generatePreviews();
  }

  generatePreviews(): void {
    this.previews = {};

    this.gallia.fields.forEach((field, index) => {
      const fieldValue = field.fieldValue.trim();

      if (!fieldValue) return;

      switch (field.visualizationType) {
        case 'qrcode':
          QRCode.toDataURL(fieldValue)
            .then((url: string) => this.previews[index] = url)
            .catch(() => this.previews[index] = '');
          break;

        case 'barcode':
          const canvas = document.createElement('canvas');
          JsBarcode(canvas, fieldValue, {
            format: "CODE128",
            displayValue: true,
            width: 2,
            height: 50
          });
          this.previews[index] = canvas.toDataURL();
          break;

        default:
          this.previews[index] = '';
          break;
      }
    });
  }

  onFieldChange(index: number): void {
    this.generatePreviews();
  }

  onSubmit(): void {
    this.isLoading = true;

    if (this.gallia.fields.some(f => !f.fieldValue)) {
      this.snackBar.open('All field values are required.', 'Close', { duration: 3000 });
      this.isLoading = false;
      return;
    }

    const payload: CreateGalliaDto = {
      labelDate: this.gallia.labelDate ? new Date(this.gallia.labelDate) : null,
      fields: this.gallia.fields.map(field => ({
        fieldValue: field.fieldValue,
        displayOrder: field.displayOrder,
        visualizationType: field.visualizationType,
        fieldName: field.fieldName || null
      }))
    };

    console.log('Submitting:', payload);

    this.galliaService.createGallia(payload).subscribe({
      next: async (createdGallia: GalliaDto) => {
        await this.saveLabelImage(createdGallia.galliaId);
        this.isLoading = false;
        this.snackBar.open('Gallia created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/prep/gallia']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.snackBar.open('Failed to create Gallia: ' + err.message, 'Close', { duration: 5000 });
        console.error('Error creating Gallia:', err);
      }
    });
  }

  async saveLabelImage(galliaId: number): Promise<void> {
    try {
      const element = document.getElementById('label-preview');
      if (!element) {
        console.error('Preview element not found');
        return;
      }

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');

      const dto: LabelImageDto = {
        galliaId: galliaId,
        base64Image: imgData
      };

      this.galliaService.saveLabelImage(dto).subscribe({
        next: () => console.log('Image saved successfully'),
        error: (err) => console.error('Error saving image:', err)
      });
    } catch (e) {
      console.error('Error generating label image:', e);
    }
  }

  // Add this missing method
  resetForm(): void {
    this.gallia = {
      labelDate: null,
      fields: []
    };
    this.desiredFieldCount = 4;
    this.previews = {};
    this.isLoading = false;
  }
}