import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SynoptiqueService, ModeDto, SynoptiqueSaveRequest, SynoptiqueEntryDto, SynoptiqueUpdateRequest, SynoptiqueUpdateResult } from '../../../Services/synoptique.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

interface RankableMode {
  mode: ModeDto;
  selected: boolean;
  order: number;
  isExisting?: boolean;
}

@Component({
  selector: 'app-synoptique',
  standalone: false,
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
  isUpdateMode = false;
  userRole: 'prep' | 'admin' | null = null; // Initialize as null
  private isUpdatingOrder = false;

  constructor(
    private synoptiqueService: SynoptiqueService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.detectUserRole();
    this.route.paramMap.subscribe(params => {
      this.productCode = params.get('ptNum') || '';
      this.isUpdateMode = this.route.snapshot.queryParamMap.get('update') === 'true';
      this.loadData();
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

  getBasePath(): string {
    return this.userRole === 'admin' ? '/admin' : '/prep';
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.synoptiqueService.getAllModes().subscribe({
      next: (modes) => {
        this.allModes = modes.map(mode => ({
          mode,
          selected: false,
          order: 0,
          isExisting: false
        }));

        if (this.isUpdateMode) {
          this.loadExistingSynoptique();
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err: Error) => {
        this.errorMessage = err.message || 'Failed to load modes';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadExistingSynoptique(): void {
    this.synoptiqueService.getSynoptiqueForProduct(this.productCode).subscribe({
      next: (entries) => {
        entries.forEach(entry => {
          const existingMode = this.allModes.find(m => m.mode.id === entry.modeID);
          if (existingMode) {
            existingMode.selected = true;
            existingMode.order = entry.ordre;
            existingMode.isExisting = true;
            this.rankedModes.push({ ...existingMode });
          }
        });
        this.reassignOrders();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          console.log('No existing synoptique found - starting fresh');
          this.isUpdateMode = false;
        } else {
          this.errorMessage = err.message || 'Failed to load existing synoptique configuration';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleModeSelection(modeItem: RankableMode): void {
    modeItem.selected = !modeItem.selected;

    if (modeItem.selected) {
      modeItem.order = this.getNextAvailableOrder();
      this.rankedModes.push({ ...modeItem });
    } else {
      const index = this.rankedModes.findIndex(m => m.mode.id === modeItem.mode.id);
      if (index !== -1) {
        this.rankedModes.splice(index, 1);
      }
      modeItem.order = 0;
    }

    this.reassignOrders();
    this.cdr.detectChanges();
  }

  getNextAvailableOrder(): number {
    if (this.rankedModes.length === 0) return 1;
    return Math.max(...this.rankedModes.map(m => m.order)) + 1;
  }

  reassignOrders(): void {
    this.rankedModes = [...this.rankedModes].sort((a, b) => a.order - b.order);
    this.rankedModes.forEach((mode, index) => {
      mode.order = index + 1;
      const originalMode = this.allModes.find(m => m.mode.id === mode.mode.id);
      if (originalMode) {
        originalMode.order = index + 1;
        originalMode.selected = true;
      }
    });
  }

  onOrderChange(modeItem: RankableMode, newOrder: number): void {
    if (this.isUpdatingOrder) return;
    if (newOrder < 1 || newOrder > this.rankedModes.length) return;

    this.isUpdatingOrder = true;

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
    this.isUpdatingOrder = false;
    this.cdr.detectChanges();
  }

  getAvailableOrders(): number[] {
    return Array.from({ length: this.rankedModes.length }, (_, i) => i + 1);
  }

  getSortedRankedModes(): RankableMode[] {
    return [...this.rankedModes].sort((a, b) => a.order - b.order);
  }

  resetSelection(): void {
    this.allModes.forEach(mode => {
      mode.selected = false;
      mode.order = 0;
    });
    this.rankedModes = [];
    this.cdr.detectChanges();
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

  prepareUpdateRequests(): SynoptiqueUpdateRequest[] {
    return this.rankedModes.map(item => ({
      modeID: item.mode.id,
      ptNum: this.productCode,
      nomMvt: item.mode.nomMode,
      ordre: item.order,
      matricule: 'SYSTEM'
    }));
  }

  async saveOrUpdate(): Promise<void> {
    if (this.rankedModes.length === 0) {
      this.errorMessage = 'Please select at least one mode to rank';
      this.cdr.detectChanges();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    try {
      if (this.isUpdateMode) {
        await this.updateSynoptique();
      } else {
        await this.saveSynoptique();
      }
    } catch (err) {
      this.errorMessage = (err as Error).message || 'Operation failed';
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  private async saveSynoptique(): Promise<void> {
    const request = this.prepareSaveRequest();
    const result = await this.synoptiqueService.saveSynoptique(request).toPromise();

    if (result?.success) {
      alert('Synoptique saved successfully!');
      this.router.navigate([`${this.getBasePath()}/dashboard`]);
    } else {
      throw new Error(result?.message || 'Failed to save synoptique');
    }
    this.isSaving = false;
    this.cdr.detectChanges();
  }

  private async updateSynoptique(): Promise<void> {
    const saveRequest = this.prepareSaveRequest();

    try {
      const result = await this.synoptiqueService.saveSynoptique(saveRequest).toPromise();
      
      if (result?.success) {
        alert('Synoptique updated successfully!');
        this.router.navigate([`${this.getBasePath()}/dashboard`]);
      } else {
        throw new Error(result?.message || 'Failed to update synoptique');
      }
    } catch (err) {
      const httpError = err as HttpErrorResponse;
      if (httpError.status === 400) {
        await this.updateEntriesIndividually();
      } else {
        throw err;
      }
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  private async updateEntriesIndividually(): Promise<void> {
    const requests = this.prepareUpdateRequests();
    const results: SynoptiqueUpdateResult[] = [];

    for (const request of requests) {
      try {
        const result = await this.synoptiqueService.updateSynoptiqueEntry(request).toPromise();
        if (result) {
          results.push(result);
        } else {
          results.push({
            success: false,
            message: 'No response from server',
            productCode: request.ptNum
          });
        }
      } catch (err) {
        const error = err as HttpErrorResponse;
        results.push({
          success: false,
          message: error.error?.message || error.message || 'Update failed',
          productCode: request.ptNum
        });

        if (error.status === 404) {
          try {
            const createResult = await this.synoptiqueService.saveSynoptique({
              ptNum: request.ptNum,
              matricule: request.matricule,
              entries: [{
                modeID: request.modeID,
                ptNum: request.ptNum,
                nomMvt: request.nomMvt,
                ordre: request.ordre
              }]
            }).toPromise();

            if (createResult?.success) {
              results[results.length - 1] = {
                success: true,
                message: 'Entry created successfully',
                productCode: request.ptNum
              };
            }
          } catch (createErr) {
            // Ignore create error, we'll show the original error
          }
        }
      }
    }

    const failedUpdates = results.filter(r => !r.success);
    if (failedUpdates.length > 0) {
      const errorMessages = failedUpdates.map(r => r.message);
      throw new Error(`Some updates failed: ${errorMessages.join(', ')}`);
    }

    alert('Synoptique updated successfully!');
    this.router.navigate([`${this.getBasePath()}/dashboard`]);
  }

  async saveAndGoToJustification(): Promise<void> {
    if (this.rankedModes.length === 0) {
      this.errorMessage = 'Please select at least one mode to rank';
      this.cdr.detectChanges();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    try {
      if (this.isUpdateMode) {
        await this.updateSynoptique();
      } else {
        await this.saveSynoptique();
      }
      this.router.navigate([`${this.getBasePath()}/products/create/serialized/justification`, this.productCode]);
    } catch (err) {
      this.errorMessage = (err as Error).message || 'Operation failed';
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }
}