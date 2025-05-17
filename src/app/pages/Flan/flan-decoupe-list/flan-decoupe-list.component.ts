import { Component, OnInit } from '@angular/core';
import { FlanDecoupeService, FlanDecoupeListResponse } from '../../../Services/flan-decoupe.service';

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

  constructor(private flanDecoupeService: FlanDecoupeService) { }

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
        this.errorMessage = err.error?.message || 'Erreur lors du chargement';
      }
    });
  }
}