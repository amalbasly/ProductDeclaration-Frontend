import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GalliaDto } from '../../../models/GalliaDto';

@Component({
  selector: 'app-label-detail-dialog',
  standalone : false,
  templateUrl: './label-detail-dialog.component.html',
  styleUrls: ['./label-detail-dialog.component.scss']
})
export class LabelDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { gallia: GalliaDto },
    public dialogRef: MatDialogRef<LabelDetailDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  print(): void {
    window.print();
  }
}