import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GalliaService } from '../../../Services/gallia.service';
import { CreateGalliaDto } from '../../../models/GalliaDto';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import JsBarcode from 'jsbarcode';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';

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
  savePath: string = "C:\\Users\\21629\\My Pc\\Desktop\\Gallia";

  visualizationOptions = [
    { value: 'qrcode', label: 'QR Code' },
    { value: 'barcode', label: 'Barcode' },
    { value: 'datametrics', label: 'Text' }
  ];

  constructor(
    private galliaService: GalliaService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  setFieldsCount(): void {
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
    this.generatePreviews();
  }

  onFieldChange(index: number): void {
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
          JsBarcode(canvas, fieldValue, { format: 'CODE128', displayValue: true });
          this.previews[index] = canvas.toDataURL();
          break;
        default:
          this.previews[index] = '';
      }
    });
  }

  async showPreview(): Promise<void> {
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '800px',
      data: {
        gallia: this.gallia,
        previews: this.previews
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    
    if (result?.action === 'save') {
      await this.onSubmit(result.element);
    } else if (result?.action === 'print') {
      this.printLabel(result.element);
    }
  }

  async onSubmit(previewElement?: HTMLElement): Promise<void> {
    this.isLoading = true;
    if (this.gallia.fields.some(f => !f.fieldValue)) {
      this.snackBar.open('All field values are required.', 'Close', { duration: 3000 });
      this.isLoading = false;
      return;
    }

    try {
      const createdGallia = await this.galliaService.createGallia(this.gallia).toPromise();
      if (createdGallia && createdGallia.galliaId) {
        await this.saveLabelImage(createdGallia.galliaId, previewElement);
      }

      this.snackBar.open('Gallia created successfully!', 'Close', { duration: 3000 });
      this.router.navigate(['/prep/gallia']);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      this.snackBar.open('Failed to create Gallia: ' + message, 'Close', { duration: 3000 });
      console.error('Error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async saveLabelImage(galliaId: number, previewElement?: HTMLElement): Promise<void> {
    try {
      const defaultPath = 'C:\\Users\\Public\\Documents\\GalliaLabels';
      const newPath = prompt('Enter the folder path to save the label:', this.savePath || defaultPath);
      
      if (!newPath) {
        console.log('User cancelled path input');
        return;
      }

      const normalizedPath = newPath.replace(/\//g, '\\').trim();

      if (!this.isValidWindowsPath(normalizedPath)) {
        this.snackBar.open('Invalid Windows path format. Example: C:\\Folder\\Subfolder', 'Close', { duration: 5000 });
        return;
      }

      const captureElement = this.createCaptureElement(previewElement);
      document.body.appendChild(captureElement);

      const canvas = await html2canvas(captureElement, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(captureElement);

      const imageData = canvas.toDataURL('image/png', 1.0);
      const cleanBase64 = imageData.split(',')[1] || imageData;

      const savingSnackbar = this.snackBar.open('Saving label image...', undefined, {
        duration: undefined
      });

      try {
        const response = await this.galliaService.saveLabelImage({
          galliaId,
          base64Image: cleanBase64,
          savePath: normalizedPath
        }).toPromise();

        savingSnackbar.dismiss();

        if (response?.savedToDisk) {
          this.snackBar.open(`Label saved to ${normalizedPath}`, 'Open Folder', { duration: 5000 })
            .onAction().subscribe(() => {
              window.open(`file:///${normalizedPath}`, '_blank');
            });
        } else if (response?.diskError) {
          this.snackBar.open(`Saved to DB but disk error: ${response.diskError}`, 'Close', { duration: 5000 });
        } else {
          this.snackBar.open('Label saved to database only', 'Close', { duration: 3000 });
        }
      } catch (e) {
        savingSnackbar.dismiss();
        const message = e instanceof Error ? e.message : 'Unknown error';
        console.error('Error saving image:', e);
        this.snackBar.open(`Error saving label image: ${message}`, 'Close', { duration: 5000 });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.error('Error in save process:', e);
      this.snackBar.open(`Error during label saving: ${message}`, 'Close', { duration: 5000 });
    }
  }

  private isValidWindowsPath(path: string): boolean {
    const windowsPathRegex = /^[a-zA-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/;
    return windowsPathRegex.test(path);
  }

  private createCaptureElement(sourceElement?: HTMLElement): HTMLElement {
    const element = sourceElement || document.getElementById('label-preview');
    if (!element) {
      throw new Error('Preview element not found');
    }

    const captureDiv = document.createElement('div');
    captureDiv.style.position = 'absolute';
    captureDiv.style.left = '-9999px';
    captureDiv.style.top = '0';
    captureDiv.style.width = '800px';
    captureDiv.style.backgroundColor = 'white';
    captureDiv.style.padding = '20px';
    captureDiv.style.boxSizing = 'border-box';

    const contentClone = element.cloneNode(true) as HTMLElement;
    const elementsToRemove = contentClone.querySelectorAll('mat-dialog-actions, button, iframe');
    elementsToRemove.forEach(el => el.remove());

    captureDiv.appendChild(contentClone);
    return captureDiv;
  }

  resetForm(): void {
    this.gallia = {
      labelDate: null,
      fields: []
    };
    this.previews = {};
    this.desiredFieldCount = 4;
  }

  printLabel(previewElement?: HTMLElement): void {
    try {
      const printContent = previewElement || document.getElementById('label-preview');
      if (!printContent) {
        throw new Error('Preview content not found');
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Gallia Label Print</title>
            <style>
              body { font-family: Arial; margin: 0; padding: 20px; }
              img { max-width: 100%; height: auto; }
              .label-container { border: 1px solid #ddd; padding: 20px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.error('Error printing:', e);
      this.snackBar.open('Error printing label: ' + message, 'Close', { duration: 3000 });
    }
  }
}
