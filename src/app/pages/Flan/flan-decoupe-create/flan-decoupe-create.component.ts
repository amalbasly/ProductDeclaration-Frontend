import { Component, OnInit } from '@angular/core';
import { FlanDecoupeService, FlanDecoupeRequest } from '../../../Services/flan-decoupe.service';
import { GalliaService } from '../../../Services/gallia.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flan-decoupe-create',
  standalone: false,
  templateUrl: './flan-decoupe-create.component.html',
  styleUrls: ['./flan-decoupe-create.component.scss']
})
export class FlanDecoupeCreateComponent implements OnInit {
  model: FlanDecoupeRequest = {
    ptNumOriginal: '',
    nombreDeParts: 1,
    labelUtilise: '',
    utilisateur: ''
  };

  productNames: string[] = [];
  labelNames: string[] = [];
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  userRole: 'prep' | 'admin' | null = null;

  constructor(
    private flanDecoupeService: FlanDecoupeService,
    private galliaService: GalliaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.detectUserRole();
    this.loadProductNames();
    this.loadLabelNames();
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

  loadProductNames(): void {
    this.flanDecoupeService.getUncutProducts().subscribe({
      next: (products) => {
        this.productNames = products.filter(product => product && product.trim() !== '');
        if (this.productNames.length > 0) {
          this.model.ptNumOriginal = this.productNames[0];
        } else {
          this.errorMessage = 'Aucun produit non découpé disponible';
        }
      },
      error: (err) => {
        console.error('Failed to fetch uncut product names', err);
        this.errorMessage = 'Échec du chargement des produits non découpés';
      }
    });
  }

  loadLabelNames(): void {
    this.galliaService.getLabelNames().subscribe({
      next: (names) => {
        this.labelNames = names.filter(name => name && name.trim() !== '');
        if (this.labelNames.length > 0) {
          this.model.labelUtilise = this.labelNames[0];
        } else {
          this.errorMessage = this.errorMessage ?
            `${this.errorMessage}; Aucun label disponible` :
            'Aucun label disponible';
        }
      },
      error: (err) => {
        console.error('Failed to fetch Etiquette label names', err);
        this.errorMessage = this.errorMessage ?
          `${this.errorMessage}; Échec du chargement des labels` :
          'Échec du chargement des labels';
      }
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.flanDecoupeService.createFlanDecoupe(this.model).subscribe({
      next: (response) => {
        this.successMessage = 'Flan découpé créé avec succès';
        setTimeout(() => {
          const basePath = this.userRole === 'admin' ? '/admin' : '/prep';
          this.router.navigate([`${basePath}/flanList`]);
        }, 1000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création';
      }
    });
  }
}