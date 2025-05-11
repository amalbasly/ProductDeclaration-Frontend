import { Component, OnInit } from '@angular/core';
import { SynoptiqueService, ModeDto, SynoptiqueSaveRequest } from '../../../Services/synoptique.service';
import { ActivatedRoute, Router } from '@angular/router';

interface RankableMode {
  mode: ModeDto;
  selected: boolean;
  order: number;
}

@Component({
  selector: 'app-synoptique',
  standalone : false,
  templateUrl: './synoptique.component.html',
  styleUrls: ['./synoptique.component.scss']
})
export class SynoptiqueComponent implements OnInit {
  allModes: RankableMode[] = [];
  rankedModes: RankableMode[] = [];
  productCode: string = '';
  isLoading = false;
  errorMessage: string | null = null;
  isSaving = false;

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
        this.allModes = modes.map(mode => ({
          mode,
          selected: false,
          order: 0
        }));
        this.rankedModes = [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load modes';
        this.isLoading = false;
      }
    });
  }

  toggleModeSelection(modeItem: RankableMode): void {
    modeItem.selected = !modeItem.selected;
    
    if (modeItem.selected) {
      modeItem.order = this.getNextAvailableOrder();
      this.rankedModes.push({...modeItem});
    } else {
      const index = this.rankedModes.findIndex(m => m.mode.id === modeItem.mode.id);
      if (index !== -1) {
        this.rankedModes.splice(index, 1);
      }
      modeItem.order = 0;
    }
    
    this.reassignOrders();
  }

  getNextAvailableOrder(): number {
    if (this.rankedModes.length === 0) return 1;
    return Math.max(...this.rankedModes.map(m => m.order)) + 1;
  }

  reassignOrders(): void {
    // Sort ranked modes by current order
    this.rankedModes.sort((a, b) => a.order - b.order);
    
    // Assign sequential orders
    this.rankedModes.forEach((mode, index) => {
      mode.order = index + 1;
      // Update order in allModes array
      const originalMode = this.allModes.find(m => m.mode.id === mode.mode.id);
      if (originalMode) {
        originalMode.order = index + 1;
      }
    });
  }

  onOrderChange(modeItem: RankableMode, newOrder: number): void {
    if (newOrder < 1 || newOrder > this.rankedModes.length) return;

    const existingItem = this.rankedModes.find(m => m.order === newOrder && m.mode.id !== modeItem.mode.id);
    
    if (existingItem) {
      existingItem.order = modeItem.order;
      const originalExisting = this.allModes.find(m => m.mode.id === existingItem.mode.id);
      if (originalExisting) originalExisting.order = modeItem.order;
    }

    modeItem.order = newOrder;
    const originalMode = this.allModes.find(m => m.mode.id === modeItem.mode.id);
    if (originalMode) originalMode.order = newOrder;
    
    this.reassignOrders();
  }

  getAvailableOrders(): number[] {
  const count = this.rankedModes.length;
  return count > 0 ? Array.from({ length: count }, (_, i) => i + 1) : [];
}

  getSortedRankedModes() {
  return [...this.allModes]
    .filter(item => item.selected)
    .sort((a, b) => a.order - b.order);
}

  resetSelection(): void {
    this.allModes.forEach(mode => {
      mode.selected = false;
      mode.order = 0;
    });
    this.rankedModes = [];
  }

  prepareSaveRequest(): SynoptiqueSaveRequest {
    return {
      ptNum: this.productCode,
      matricule: 'SYSTEM',
      entries: this.rankedModes.map(item => ({
        modeID: item.mode.id,
        ptNum: this.productCode,
        nomMvt: item.mode.nomMode,
        ordre: item.order
      }))
    };
  }

  saveSynoptique(): void {
    if (this.rankedModes.length === 0) {
      this.errorMessage = 'Please select at least one mode to rank';
      return;
    }

    this.isSaving = true;
    const request = this.prepareSaveRequest();

    this.synoptiqueService.saveSynoptique(request).subscribe({
      next: (result) => {
        this.isSaving = false;
        if (result.success) {
          alert('Ranking saved successfully!');
          this.router.navigate(['/prep/dashboard']);
        } else {
          this.errorMessage = result.message || 'Failed to save ranking';
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Failed to save ranking';
      }
    });
  }

  saveAndGoToJustification(): void {
    if (this.rankedModes.length === 0) {
      this.errorMessage = 'Please select at least one mode to rank';
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
          this.errorMessage = result.message || 'Failed to save ranking';
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Failed to save ranking';
      }
    });
  }
}