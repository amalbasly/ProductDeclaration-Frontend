import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { GalliaService } from '../../../Services/gallia.service';
import { CreateGalliaDto } from '../../../models/GalliaDto';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import JsBarcode from 'jsbarcode';
import { MatDialog } from '@angular/material/dialog';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';

@Component({
  selector: 'app-gallia-create',
  standalone: false,
  templateUrl: './gallia-create.component.html',
  styleUrls: ['./gallia-create.component.scss']
})
export class GalliaCreateComponent implements OnInit {
  gallia: CreateGalliaDto = {
    labelDate: new Date().toISOString().split('T')[0],
    fields: [],
    labelName: 'Gallia',
    galliaName: ''
  };

  desiredFieldCount = 4;
  previews: { [key: number]: string } = {};
  isLoading = false;
  savePath: string = 'C:\\Users\\21629\\My Pc\\Desktop\\Gallia';
  labelType: string = 'Gallia';

  visualizationOptions = [
    { value: 'qrcode', label: 'QR Code' },
    { value: 'barcode', label: 'Barcode' },
    { value: 'datametrics', label: 'Text' }
  ];
  userRole: 'prep' | 'admin' = 'prep';

  constructor(
    private galliaService: GalliaService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      this.labelType = segments.some(s => s.path === 'create-etiquette') ? 'Etiquette' : 'Gallia';
      this.gallia.labelName = this.labelType;
    });

    this.detectUserRole();
  }

  detectUserRole(): void {
    const urlSegment = this.route.snapshot.pathFromRoot
      .map(r => r.routeConfig?.path)
      .filter(path => !!path)
      .join('/');
    if (urlSegment.includes('admin')) {
      this.userRole = 'admin';
    } else {
      this.userRole = 'prep';
    }
  }

  setFieldsCount(): void {
    if (this.desiredFieldCount < 1 || this.desiredFieldCount > 20) {
      this.showError('Please choose between 1 and 20 fields.');
      return;
    }

    const defaultFieldNames = ['Product Code', 'Batch Number', 'Expiry Date', 'Quantity'];
    this.gallia.fields = Array.from({ length: this.desiredFieldCount }, (_, i) => ({
      fieldValue: '',
      displayOrder: i + 1,
      visualizationType: i === 0 ? 'qrcode' : i === 1 ? 'barcode' : 'datametrics',
      fieldName: defaultFieldNames[i] || `Field ${i + 1}`
    }));
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

      try {
        switch (field.visualizationType) {
          case 'qrcode':
            QRCode.toDataURL(fieldValue, { width: 100, margin: 0 })
              .then((url: string) => (this.previews[index] = url))
              .catch(() => {
                this.previews[index] = '';
                this.showError(`Invalid QR Code data for ${field.fieldName || `Field ${index + 1}`}`);
              });
            break;
          case 'barcode':
            if (!/^[0-9A-Za-z\s\-]+$/.test(fieldValue)) {
              this.previews[index] = '';
              this.showError(`Invalid Barcode data for ${field.fieldName || `Field ${index + 1}`}. Use alphanumeric characters.`);
              return;
            }
            const canvas = document.createElement('canvas');
            JsBarcode(canvas, fieldValue, {
              format: 'CODE128',
              displayValue: false,
              height: 40,
              margin: 0
            });
            this.previews[index] = canvas.toDataURL();
            break;
          default:
            this.previews[index] = '';
        }
      } catch (error) {
        this.previews[index] = '';
        this.showError(`Error generating preview for ${field.fieldName || `Field ${index + 1}`}`);
      }
    });
  }

  async showPreview(): Promise<void> {
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '900px',
      data: {
        gallia: this.gallia,
        previews: this.previews,
        generateLabelCanvas: this.generateLabelCanvas.bind(this)
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result?.gallia?.action === 'save') {
      await this.onSubmit();
    } else if (result?.gallia?.action === 'print') {
      this.printLabel();
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) return;

    this.isLoading = true;
    try {
      const createdGallia = await this.galliaService.createGallia(this.gallia, this.labelType).toPromise();
      if (createdGallia?.galliaId) {
        await this.saveLabelImage(createdGallia.galliaId);
      }
      this.showSuccess(`${this.labelType} created successfully!`);
      this.router.navigate([`/${this.userRole}/${this.labelType.toLowerCase()}`]);
    } catch (error) {
      this.showError(`Failed to create ${this.labelType}: ${this.getErrorMessage(error)}`);
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (this.gallia.fields.some(f => !f.fieldValue.trim())) {
      this.showError('All field values are required.');
      return false;
    }
    if (!this.gallia.galliaName?.trim()) {
      this.showError(`${this.labelType} name is required.`);
      return false;
    }
    if (!this.gallia.labelDate) {
      this.showError('Label date is required.');
      return false;
    }
    return true;
  }

  private async saveLabelImage(galliaId: number): Promise<void> {
    try {
      const path = prompt('Save folder path:', this.savePath);
      if (!path || !this.isValidWindowsPath(path)) {
        this.showError('Invalid or empty path. Please provide a valid Windows path.');
        return;
      }

      const normalizedPath = path.replace(/\//g, '\\').trim();
      const canvas = await this.generateLabelCanvas();
      const imageData = canvas.toDataURL('image/png').split(',')[1];

      const response = await this.galliaService.saveLabelImage({
        galliaId,
        base64Image: imageData,
        savePath: normalizedPath
      }, this.labelType).toPromise();

      this.handleSaveResponse(response, normalizedPath);
    } catch (error) {
      this.showError(`Error saving label image: ${this.getErrorMessage(error)}`);
    }
  }

  private async generateLabelCanvas(): Promise<HTMLCanvasElement> {
    const container = document.createElement('div');
    container.style.width = '595px'; // A5 width at 96 DPI
    container.style.height = '842px'; // A5 height
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = '"Lato", sans-serif';
    container.style.padding = '15px';
    container.style.boxSizing = 'border-box';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.border = '1px solid #0b6985';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.05)';
    container.style.background = 'linear-gradient(180deg, #ffffff, #edf2f7)';

    // Header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.padding = '10px';
    header.style.backgroundColor = '#0b6985';
    header.style.borderRadius = '6px 6px 0 0';
    header.style.margin = '-15px -15px 15px -15px';

    const logo = document.createElement('img');
    logo.src = '/assets/images/gallia-logo.png';
    logo.style.width = '100px';
    logo.style.height = '40px';
    logo.style.marginRight = '15px';
    header.appendChild(logo);

    const titleContainer = document.createElement('div');
    titleContainer.style.flex = '1';
    titleContainer.style.textAlign = 'center';

    const title = document.createElement('div');
    title.style.fontFamily = '"Fjalla One", sans-serif';
    title.style.fontSize = '26px';
    title.style.fontWeight = '400';
    title.style.color = '#ffffff';
    title.style.textTransform = 'uppercase';
    title.textContent = this.gallia.galliaName || 'Gallia Label';
    titleContainer.appendChild(title);

    const subtitle = document.createElement('div');
    subtitle.style.fontFamily = '"Lato", sans-serif';
    subtitle.style.fontSize = '12px';
    subtitle.style.color = '#edf2f7';
    subtitle.textContent = `Date: ${this.gallia.labelDate ? new Date(this.gallia.labelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}`;
    titleContainer.appendChild(subtitle);

    header.appendChild(titleContainer);
    container.appendChild(header);

    // Main Content
    const content = document.createElement('div');
    content.style.flexGrow = '1';
    content.style.padding = '10px';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.gap = '15px';

    // Fields Section
    const fieldsContainer = document.createElement('div');
    fieldsContainer.style.display = 'flex';
    fieldsContainer.style.flexDirection = 'column';
    fieldsContainer.style.gap = '10px';
    fieldsContainer.style.padding = '10px';
    fieldsContainer.style.backgroundColor = '#ffffff';
    fieldsContainer.style.border = '1px solid #edf2f7';
    fieldsContainer.style.borderRadius = '6px';

    const visualizationPromises = this.gallia.fields.map((field, index) => {
      return new Promise<void>((resolve) => {
        const fieldRow = document.createElement('div');
        fieldRow.style.display = 'flex';
        fieldRow.style.alignItems = 'center';
        fieldRow.style.padding = '8px 0';
        fieldRow.style.borderBottom = index < this.gallia.fields.length - 1 ? '1px dotted #edf2f7' : 'none';

        const fieldInfo = document.createElement('div');
        fieldInfo.style.flex = '1';

        const fieldName = document.createElement('div');
        fieldName.style.fontFamily = '"Fjalla One", sans-serif';
        fieldName.style.fontWeight = '500';
        fieldName.style.fontSize = '14px';
        fieldName.style.color = '#0b6985';
        fieldName.textContent = field.fieldName || `Field ${index + 1}`;
        fieldInfo.appendChild(fieldName);

        const fieldValue = document.createElement('div');
        fieldValue.style.fontFamily = '"Lato", sans-serif';
        fieldValue.style.fontSize = '12px';
        fieldValue.style.color = '#074f63';
        fieldValue.style.wordBreak = 'break-word';
        fieldValue.textContent = field.fieldValue || 'No value';
        fieldInfo.appendChild(fieldValue);

        fieldRow.appendChild(fieldInfo);

        const visualization = document.createElement('div');
        visualization.style.width = '120px';
        visualization.style.display = 'flex';
        visualization.style.justifyContent = 'center';
        visualization.style.alignItems = 'center';
        visualization.style.padding = '5px';
        visualization.style.backgroundColor = '#ffffff';
        visualization.style.border = '1px solid #edf2f7';
        visualization.style.borderRadius = '4px';

        if (field.visualizationType === 'qrcode' && this.previews[index]) {
          const qrImg = document.createElement('img');
          qrImg.src = this.previews[index];
          qrImg.style.width = '80px';
          qrImg.style.height = '80px';
          visualization.appendChild(qrImg);
        } else if (field.visualizationType === 'barcode' && this.previews[index]) {
          const barcodeImg = document.createElement('img');
          barcodeImg.src = this.previews[index];
          barcodeImg.style.width = '100%';
          barcodeImg.style.height = '40px';
          visualization.appendChild(barcodeImg);
        } else {
          const textViz = document.createElement('div');
          textViz.textContent = field.fieldValue || '';
          textViz.style.fontFamily = '"Lato", sans-serif';
          textViz.style.fontSize = '12px';
          textViz.style.color = '#074f63';
          textViz.style.textAlign = 'center';
          textViz.style.padding = '5px';
          visualization.appendChild(textViz);
        }

        fieldRow.appendChild(visualization);
        fieldsContainer.appendChild(fieldRow);
        resolve();
      });
    });

    await Promise.all(visualizationPromises);
    content.appendChild(fieldsContainer);

    // Additional Info (e.g., Serial Number, Contact)
    const infoContainer = document.createElement('div');
    infoContainer.style.display = 'flex';
    infoContainer.style.justifyContent = 'space-between';
    infoContainer.style.fontFamily = '"Lato", sans-serif';
    infoContainer.style.fontSize = '10px';
    infoContainer.style.color = '#074f63';
    infoContainer.style.padding = '8px';
    infoContainer.style.backgroundColor = '#edf2f7';
    infoContainer.style.borderRadius = '6px';

    const serial = document.createElement('div');
    serial.textContent = `Serial: G-${Math.floor(100000 + Math.random() * 900000)}`;
    infoContainer.appendChild(serial);

    const contact = document.createElement('div');
    contact.textContent = 'Contact: support@gallia.com';
    infoContainer.appendChild(contact);

    content.appendChild(infoContainer);
    container.appendChild(content);

    // Footer
    const footer = document.createElement('div');
    footer.style.fontFamily = '"Lato", sans-serif';
    footer.style.fontSize = '10px';
    footer.style.color = '#ffffff';
    footer.style.textAlign = 'center';
    footer.style.padding = '10px';
    footer.style.backgroundColor = '#0b6985';
    footer.style.borderRadius = '0 0 6px 6px';
    footer.style.margin = '15px -15px -15px -15px';
    footer.textContent = `Manufactured by Gallia Systems, Inc. | www.gallia.com | ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`;
    container.appendChild(footer);

    document.body.appendChild(container);
    const canvas = await html2canvas(container, {
      scale: 2,
      logging: false,
      backgroundColor: null,
      removeContainer: true
    });
    document.body.removeChild(container);

    return canvas;
  }

  private handleSaveResponse(response: any, path: string): void {
    if (response?.savedToDisk) {
      this.snackBar.open(`Label saved to ${path}`, 'Open', { duration: 5000 })
        .onAction().subscribe(() => window.open(`file:///${path}`, '_blank'));
    } else {
      this.showError(response?.diskError || 'Label saved to database only');
    }
  }

  private isValidWindowsPath(path: string): boolean {
    return /^[a-zA-Z]:\\(.+\\)*[^<>:"|?*]+$/.test(path);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private getErrorMessage(error: any): string {
    return error instanceof Error ? error.message : JSON.stringify(error);
  }

  printLabel(): void {
    this.generateLabelCanvas().then(canvas => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Gallia Label</title>
              <style>
                body { margin: 0; padding: 0; }
                img { max-width: 100%; height: auto; }
                @page { size: A5; margin: 0; }
              </style>
            </head>
            <body>
              <img src="${canvas.toDataURL('image/png')}">
              <script>window.print(); setTimeout(() => window.close(), 1000);</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    });
  }

  resetForm(): void {
    this.gallia = {
      labelDate: new Date().toISOString().split('T')[0],
      fields: [],
      labelName: this.labelType,
      galliaName: ''
    };
    this.desiredFieldCount = 4;
    this.previews = [];
  }
}