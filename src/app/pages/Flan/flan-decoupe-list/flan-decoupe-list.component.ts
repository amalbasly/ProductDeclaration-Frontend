import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router'; // <-- import ActivatedRoute

import {
  FlanDecoupeService,
  FlanDecoupeListResponse,
  FlanDecoupeResponse
} from '../../../Services/flan-decoupe.service';

@Component({
  selector: 'app-flan-decoupe-list',
  standalone: false,
  templateUrl: './flan-decoupe-list.component.html',
  styleUrls: ['./flan-decoupe-list.component.scss']
})
export class FlanDecoupeListComponent implements OnInit {
  flanDecoupes: FlanDecoupeListResponse = {
    success: true,
    flanDecoupes: []
  };
  isLoading = true;
  errorMessage: string | null = null;
  selectedFlanDecoupe: FlanDecoupeResponse | null = null;
  userRole: 'prep' | 'admin' = 'prep'; // default role

  constructor(
    private flanDecoupeService: FlanDecoupeService,
    private modalService: NgbModal,
    private route: ActivatedRoute  // <-- inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.detectUserRole();
    this.loadFlanDecoupes();
  }

  detectUserRole(): void {
    // Detect role by checking route path segments
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

  loadFlanDecoupes() {
    this.isLoading = true;
    this.errorMessage = null;

    this.flanDecoupeService.getFlanDecoupes().subscribe({
      next: (response) => {
        this.flanDecoupes = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des données';
      }
    });
  }

  openDetails(item: FlanDecoupeResponse, content: any) {
    this.flanDecoupeService.getFlanDecoupes(item.idDecoupe).subscribe({
      next: (response) => {
        if (response.success && response.flanDecoupes.length > 0) {
          this.selectedFlanDecoupe = response.flanDecoupes[0];
          this.modalService.open(content, { size: 'lg' });
        } else {
          this.errorMessage = 'Aucun détail trouvé pour cet élément.';
        }
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des détails.';
      }
    });
  }

  getNewFlanLink(): string {
    return this.userRole === 'admin' ? '/admin/flanC' : '/prep/flanC';
  }
}
