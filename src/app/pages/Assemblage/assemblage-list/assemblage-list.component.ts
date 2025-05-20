import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssemblageService, AssemblageDto } from '../../../Services/assemblage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-assemblage-list',
  standalone : false,
  templateUrl: './assemblage-list.component.html',
  styleUrls: ['./assemblage-list.component.scss']
})
export class AssemblageListComponent implements OnInit {
  assemblages: AssemblageDto[] = [];
  loading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  confirmDeleteId: number | null = null;
  selectedAssemblage: AssemblageDto | null = null;
  userRole: 'prep' | 'admin' = 'prep'; // default role

  constructor(
    private assemblageService: AssemblageService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.detectUserRole();
    this.loadAssemblages();
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

  loadAssemblages(): void {
    this.loading = true;
    this.errorMessage = null;
    this.assemblageService.getAllAssemblages().subscribe({
      next: (data) => {
        this.assemblages = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load assemblages', err);
        this.errorMessage = `Failed to load assemblages: ${err.message}`;
        this.loading = false;
      }
    });
  }

  openDetails(assemblage: AssemblageDto, content: any): void {
    this.assemblageService.getAssemblageById(assemblage.assemblageId).subscribe({
      next: (response) => {
        if (response) {
          this.selectedAssemblage = response;
          this.modalService.open(content, { size: 'lg' });
        } else {
          this.errorMessage = 'No details found for this assemblage.';
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load assemblage details', err);
        this.errorMessage = `Failed to load assemblage details: ${err.message}`;
      }
    });
  }

  editAssemblage(id: number): void {
    this.router.navigate([`/${this.userRole}/assemblageC`, id]);
  }

  confirmDelete(id: number): void {
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  deleteAssemblage(): void {
    if (this.confirmDeleteId === null) return;

    this.loading = true;
    this.assemblageService.deleteAssemblage(this.confirmDeleteId).subscribe({
      next: () => {
        this.successMessage = 'Assemblage deleted successfully';
        this.confirmDeleteId = null;
        this.loadAssemblages();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to delete assemblage', err);
        this.errorMessage = `Failed to delete assemblage: ${err.message}`;
        this.loading = false;
      }
    });
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
