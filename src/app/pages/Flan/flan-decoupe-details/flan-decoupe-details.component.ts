import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlanDecoupeService, FlanDecoupeResponse } from '../../../Services/flan-decoupe.service';

@Component({
  selector: 'app-flan-decoupe-details',
  standalone : false,
  templateUrl: './flan-decoupe-details.component.html',
  styleUrls: ['./flan-decoupe-details.component.scss']
})
export class FlanDecoupeDetailsComponent implements OnInit {
  flanDecoupe: FlanDecoupeResponse | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private flanDecoupeService: FlanDecoupeService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFlanDecoupe(+id);
    }
  }

  loadFlanDecoupe(id: number) {
    this.isLoading = true;
    this.errorMessage = null;

    this.flanDecoupeService.getFlanDecoupes(id).subscribe({
      next: (response) => {
        if (response.flanDecoupes.length > 0) {
          this.flanDecoupe = response.flanDecoupes[0];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors du chargement';
      }
    });
  }
}