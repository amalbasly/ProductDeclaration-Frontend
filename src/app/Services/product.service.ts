import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

interface DropdownOptions {
  lignes: string[];
  famille: string[];
  sousFamilles: string[];
  types: string[];
  statuts: string[];
}

interface ProductCreateResponse {
  result: string;
  message: string;
  productCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5134/api/Products';

  constructor(private http: HttpClient) { }

  getDropdownOptions(): Observable<DropdownOptions> {
    return this.http.get<DropdownOptions>(`${this.apiUrl}/GetOptions`).pipe(
      catchError(error => {
        console.error('Error fetching dropdown options:', error);
        throw error;
      })
    );
  }

  checkProductCode(code: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(
      `${this.apiUrl}/CheckProductCode?code=${encodeURIComponent(code)}`
    ).pipe(
      catchError(error => {
        console.error('Error checking product code:', error);
        throw error;
      })
    );
  }

  createProduct(productData: any): Observable<ProductCreateResponse> {
    const params = new HttpParams({fromObject: productData})
      .set('ligne', productData.ligne || '')
      .set('famille', productData.famille || '')
      .set('sousFamille', productData.sousFamille || '')
      .set('codeProduit', productData.codeProduit || '')
      .set('libelle', productData.libelle || '')
      .set('type', productData.type || '')
      .set('libelle2', productData.libelle2 || '')
      .set('statut', productData.statut || '')
      .set('codeProduitClientC264', productData.codeProduitClientC264 || '')
      .set('poids', productData.poids?.toString() || '')
      .set('createur', productData.createur || '')
      .set('dateCreation', productData.dateCreation || '')
      .set('tolerance', productData.tolerance || '')
      .set('flashable', productData.flashable?.toString() || '');

    return this.http.post<ProductCreateResponse>(
      `${this.apiUrl}/CreateProduct`, 
      {}, 
      { params }
    ).pipe(
      catchError(error => {
        console.error('Error creating product:', error);
        return throwError(() => ({
          error: {
            result: 'Error',
            message: error.error?.message || 'Unknown error occurred'
          }
        }));
      })
    );
  }
}