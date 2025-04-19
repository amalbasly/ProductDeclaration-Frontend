import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

interface ProductCreateRequest {
  ligne: string;
  famille: string;
  sousFamille: string;
  codeProduit: string;
  libelle: string;
  type?: string;
  libelle2?: string;
  statut?: string;
  codeProduitClientC264?: string;
  poids?: number;
  createur?: string;
  dateCreation?: Date;
  tolerance?: string;
  flashable?: boolean;
}

interface ApiResponse {
  Result: string;
  Message: string;
  ProductCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5134/api/Products';
  private headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  constructor(private http: HttpClient) { }

  createProduct(productData: ProductCreateRequest): Observable<ApiResponse> {
    const body = new URLSearchParams();
    
    // Required fields
    body.set('ligne', productData.ligne);
    body.set('famille', productData.famille);
    body.set('sousFamille', productData.sousFamille);
    body.set('codeProduit', productData.codeProduit);
    body.set('libelle', productData.libelle);

    // Optional fields
    if (productData.type) body.set('type', productData.type);
    if (productData.libelle2) body.set('libelle2', productData.libelle2);
    if (productData.statut) body.set('statut', productData.statut);
    if (productData.codeProduitClientC264) body.set('codeProduitClientC264', productData.codeProduitClientC264);
    if (productData.poids) body.set('poids', productData.poids.toString());
    if (productData.createur) body.set('createur', productData.createur);
    if (productData.dateCreation) body.set('dateCreation', productData.dateCreation.toISOString());
    if (productData.tolerance) body.set('tolerance', productData.tolerance);
    body.set('flashable', productData.flashable ? '1' : '0');

    return this.http.post<ApiResponse>(
      `${this.apiUrl}/CreateProduct`,
      body.toString(),
      { headers: this.headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.error?.Message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}