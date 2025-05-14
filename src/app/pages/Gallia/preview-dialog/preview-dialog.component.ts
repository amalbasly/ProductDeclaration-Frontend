// preview-dialog.component.ts
import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-dialog',
  standalone : false,
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent {
@ViewChild('previewContent') previewContent!: ElementRef;
today: Date = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { gallia: any, previews: any },
    public dialogRef: MatDialogRef<PreviewDialogComponent>
  ) {}

  print(): void {
    this.dialogRef.close({ action: 'print', element: this.previewContent.nativeElement });
  }

  save(): void {
    this.dialogRef.close({ action: 'save', element: this.previewContent.nativeElement });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}