import { Component, OnInit } from '@angular/core';
import { SynoptiqueService, Mode, SynoptiqueEntry, SynoptiqueSaveRequest } from '../../../Services/synoptique.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-synoptique',
  standalone : false,
  templateUrl: './synoptique.component.html',
  styleUrls: ['./synoptique.component.css']
})
export class SynoptiqueComponent implements OnInit {
  modes: Mode[] = [];
  rankedModes: {mode: Mode, order: number}[] = [];
  productCode: string = '';
  isLoading = false;
  errorMessage: string | null = null;
  isSaving = false;
  orderOptions: number[] = [];

  constructor(
    private synoptiqueService: SynoptiqueService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productCode = params.get('ptNum') || '';
      
      if (!this.productCode) {
        this.errorMessage = 'Product code is missing. Please create the product first.';
        return;
      }
      
      this.loadModes();
    });
  }

  loadModes(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.synoptiqueService.getAllModes().subscribe({
      next: (modes) => {
        this.modes = modes;
        this.orderOptions = Array.from({length: modes.length}, (_, i) => i + 1);
        
        // Initialize ranking with default order
        this.rankedModes = modes.map((mode, index) => ({
          mode,
          order: index + 1
        }));
        
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load modes. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onRankChange(): void {
    // Sort the modes based on the selected order
    this.rankedModes.sort((a, b) => a.order - b.order);
    
    // Reassign orders to ensure no duplicates and sequential numbering
    this.rankedModes.forEach((item, index) => {
      item.order = index + 1;
    });
  }

  saveSynoptique(): void {
    if (!this.productCode) {
      this.errorMessage = 'Product code is required';
      return;
    }

    this.isSaving = true;
    const request: SynoptiqueSaveRequest = {
      ptNum: this.productCode,
      matricule: 'CURRENT_USER', // Replace with actual user if available
      entries: this.rankedModes.map(item => ({
        modeID: item.mode.id,
        ptNum: this.productCode,
        nomMvt: item.mode.nomMode,
        ordre: item.order
      }))
    };

    this.synoptiqueService.saveSynoptique(request).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Synoptique saved successfully!');
        this.router.navigate(['/prep/dashboard']);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = 'Failed to save synoptique. Please try again.';
      }
    });
  }
}