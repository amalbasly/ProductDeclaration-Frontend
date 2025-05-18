import {
  Component,
  OnInit
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// DTOs from your service
import {
  FlanDecoupeService,
  FlanDecoupeListResponse,
  FlanDecoupeResponse
} from '../../../Services/flan-decoupe.service';

@Component({
  selector: 'app-flan-decoupe-list',
  standalone : false,
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

  constructor(
    private flanDecoupeService: FlanDecoupeService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadFlanDecoupes();
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
    // Reuse existing API: GET /api/FlanDecoupe?id=...
    this.flanDecoupeService.getFlanDecoupes(item.idDecoupe).subscribe({
      next: (response) => {
        if (response.success && response.flanDecoupes.length > 0) {
          this.selectedFlanDecoupe = response.flanDecoupes[0]; // get first (only) item
          this.modalService.open(content, { size: 'lg' });
        } else {
          this.errorMessage = 'Aucun détail trouvé pour cet élément.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des détails.';
      }
    });
  }
}