import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateGalliaDto } from '../../../models/GalliaDto';

interface PreviewDialogData {
  gallia: CreateGalliaDto & { action?: string };
  previews: { [key: number]: string };
  generateLabelCanvas: () => Promise<HTMLCanvasElement>;
}

@Component({
  selector: 'app-preview-dialog',
  standalone: false,
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit {
  previewImage: string | null = null;
  today = new Date();

  constructor(
    public dialogRef: MatDialogRef<PreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PreviewDialogData
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const canvas = await this.data.generateLabelCanvas();
      this.previewImage = canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating preview:', error);
      this.previewImage = null;
    }
  }

  print(): void {
    this.data.gallia.action = 'print';
    this.dialogRef.close(this.data);
  }

  save(): void {
    this.data.gallia.action = 'save';
    this.dialogRef.close(this.data);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}