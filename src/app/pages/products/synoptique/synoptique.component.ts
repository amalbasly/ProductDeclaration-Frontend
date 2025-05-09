import { Component, OnInit } from '@angular/core';
import { SynoptiqueService, ModeDto, SynoptiqueEntryDto, SynoptiqueSaveRequest, SynoptiqueSaveResult } from '../../../Services/synoptique.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-synoptique',
  standalone : false,
  templateUrl: './synoptique.component.html',
  styleUrls: ['./synoptique.component.scss']
})
export class SynoptiqueComponent implements OnInit {
  modes: ModeDto[] = [];
  rankedModes: { mode: ModeDto, order: number }[] = [];
  productCode: string = '';
  isLoading = false;
  errorMessage: string | null = null;
  isSaving = false;
  orderOptions: number[] = [];

  constructor(
    private synoptiqueService: SynoptiqueService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productCode = params.get('ptNum') || '';
      this.loadModes();
    });
  }

  loadModes(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.synoptiqueService.getAllModes().subscribe({
      next: (modes) => {
        this.modes = modes;
        this.initializeRanking();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  initializeRanking(): void {
    this.orderOptions = Array.from({ length: this.modes.length }, (_, i) => i + 1);
    this.rankedModes = this.modes.map((mode, index) => ({
      mode,
      order: index + 1
    }));
  }

  onRankChange(): void {
    this.rankedModes.sort((a, b) => a.order - b.order);
    this.rankedModes.forEach((item, index) => {
      item.order = index + 1;
    });
  }

  prepareSaveRequest(): SynoptiqueSaveRequest {
    return {
      ptNum: this.productCode,
      matricule: 'SYSTEM', // Default value matching your backend
      entries: this.rankedModes.map(item => ({
        modeID: item.mode.id,
        ptNum: this.productCode,
        nomMvt: item.mode.nomMode,
        ordre: item.order
      }))
    };
  }

  saveSynoptique(): void {
    if (!this.productCode) {
      this.errorMessage = 'Product code is required';
      return;
    }

    this.isSaving = true;
    const request = this.prepareSaveRequest();

    this.synoptiqueService.saveSynoptique(request).subscribe({
      next: (result) => {
        this.isSaving = false;
        if (result.success) {
          alert(result.message);
          this.router.navigate(['/prep/dashboard']);
        } else {
          this.errorMessage = result.message;
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message;
      }
    });
  }

  saveAndGoToJustification(): void {
    if (!this.productCode) {
      this.errorMessage = 'Product code is required';
      return;
    }

    this.isSaving = true;
    const request = this.prepareSaveRequest();

    this.synoptiqueService.saveSynoptique(request).subscribe({
      next: (result) => {
        this.isSaving = false;
        if (result.success) {
          this.router.navigate(['/prep/products/create/serialized/justification', this.productCode]);
        } else {
          this.errorMessage = result.message;
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message;
      }
    });
  }
}