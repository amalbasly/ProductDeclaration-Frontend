import { Component, OnInit } from '@angular/core';
import { GalliaService } from '../../../Services/gallia.service';
import { GalliaDto } from '../../../models/GalliaDto';
import { MatDialog } from '@angular/material/dialog';
import { LabelDetailDialogComponent } from '../label-detail-dialog/label-detail-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gallia-list',
  standalone: false,
  templateUrl: './gallia-list.component.html',
  styleUrls: ['./gallia-list.component.scss']
})
export class GalliaListComponent implements OnInit {
  gallias: GalliaDto[] = [];
  labelName: string | null = null;
  isLoading = true;
  displayedColumns: string[] = ['thumbnail', 'id', 'galliaName', 'date', 'created', 'actions'];
  labelType = 'Gallia'; // Default labelType
  userRole: 'prep' | 'admin' = 'prep';

  constructor(
    private galliaService: GalliaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.detectUserRole();  // Detect role at start

    this.route.url.subscribe((segments) => {
      if (segments.some((segment) => segment.path === 'etiquette')) {
        this.labelName = 'Etiquette';
        this.labelType = 'Etiquette';
      } else {
        this.labelName = 'Gallia';
        this.labelType = 'Gallia';
      }
      this.loadGallias();
    });
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

  getCreateRoute(): string {
    if (this.labelName === 'Etiquette') {
      return this.userRole === 'admin' ? '/admin/create-etiquette' : '/prep/create-etiquette';
    } else {
      return this.userRole === 'admin' ? '/admin/createG' : '/prep/createG';
    }
  }

  loadGallias(): void {
    this.isLoading = true;
    this.galliaService.getAllGallias(this.labelType).subscribe({
      next: (data) => {
        this.gallias = data.filter((gallia) => gallia.labelName === this.labelName);
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load Gallias', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  viewDetails(gallia: GalliaDto): void {
    this.dialog.open(LabelDetailDialogComponent, {
      width: '800px',
      data: { gallia }
    });
  }

  deleteGallia(id: number): void {
    if (confirm('Are you sure you want to delete this Gallia label?')) {
      this.galliaService.deleteGallia(id, this.labelType).subscribe({
        next: () => {
          this.snackBar.open('Gallia deleted successfully', 'Close', { duration: 3000 });
          this.loadGallias();
        },
        error: () => {
          this.snackBar.open('Failed to delete Gallia', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
