import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService, ProduitSerialiséDto } from '../../../Services/product.service';
import { JustificationService } from '../../../Services/justification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DialogData {
  product: ProduitSerialiséDto;
  managerId: string;
}

interface JustificationDto {
  JustificationID: number;
  ProductCode: string;
  ProductName?: string;
  JustificationText?: string;
  UrgencyLevel?: string;
  Status?: string;
  SubmittedBy?: string;
  SubmissionDate: Date;
  DecisionComments?: string;
  DecisionDate?: Date;
  DecidedBy?: string;
}

@Component({
  selector: 'app-product-justification-dialog',
  standalone: false,
  templateUrl: './product-justification-dialog.component.html',
  styleUrls: ['./product-justification-dialog.component.scss']
})
export class ProductJustificationDialogComponent {
  justification: JustificationDto | null = null;
  loading = false;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<ProductJustificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private justificationService: JustificationService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
    this.loadJustification();
  }

  loadJustification(): void {
    this.loading = true;
    this.error = '';
    this.justificationService.getJustifications(this.data.product.PtNum).subscribe({
      next: (justifications: JustificationDto[]) => {
        this.justification = justifications.length > 0 ? justifications[0] : null; // Get the latest justification
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load justification: ' + (err.error?.message || err.message || 'Unknown error');
        this.loading = false;
      }
    });
  }

  acceptProduct(): void {
    this.verifyProduct(true);
  }

  declineProduct(): void {
    this.verifyProduct(false);
  }

  verifyProduct(isApproved: boolean): void {
    this.loading = true;
    this.productService.verifyProduct({
      ProductId: this.data.product.PtNum,
      Token: 'manager-token', // Replace with actual token logic
      IsApproved: isApproved,
      DecisionComments: isApproved ? 'Approved by traceability manager' : 'Declined by traceability manager'
    }, this.data.managerId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.Result?.toLowerCase() === 'success') {
          this.snackBar.open(`Product ${isApproved ? 'accepted' : 'declined'} successfully`, 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        } else {
          this.error = response.Message || 'Failed to verify product';
          this.snackBar.open(this.error, 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.error = 'Failed to verify product: ' + (err.error?.Message || err.message);
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}