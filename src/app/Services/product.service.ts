import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap, of } from 'rxjs';
import { DropdownOptions, ProductCreateResponse, ProductResponse } from '../models/product';

export interface Product {
  ptNum: string;
  ptLib: string;
  fpCod: string;
  spCod: string;
  spId: string;
  isSerialized: boolean;
  ptPoids: number;
  ptDcreat: Date;
}

export interface DeleteResponse {
    result: string;  // Changed from 'Result' to 'result'
    message: string; // Changed from 'Message' to 'message'
    productCode: string; // Changed from 'ProductCode' to 'productCode'
  }



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5134/api/Products';

  constructor(private http: HttpClient) {}

  getProducts(codeProduit?: string, status?: string, isSerialized?: boolean): Observable<ProductResponse> {
    let params = new HttpParams();

    if (codeProduit) {
      params = params.set('CodeProduit', codeProduit);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (isSerialized !== undefined) {
      params = params.set('isSerialized', isSerialized.toString());
    }

    return this.http.get<ProductResponse>(`${this.apiUrl}/GetProduct`, { params });
  }

  deleteProduct(ptNum: string): Observable<DeleteResponse> {
    if (!ptNum) {
      return of({
        result: 'Error',
        message: 'Product code is required',
        productCode: ptNum
      });
    }
  
    return this.http.delete<DeleteResponse>(
      `${this.apiUrl}/DeleteProduct/${encodeURIComponent(ptNum)}`
    ).pipe(
      catchError(error => {
        console.error('Delete error:', error);
        return of({
          result: 'Error',
          message: error.error?.message || error.message || 'Failed to delete product',
          productCode: ptNum
        });
      })
    );
  }
  


  private parseConstraintError(error: HttpErrorResponse): { 
    message: string; 
    tableName: string 
  } {
    const errorMessage = error.error?.Message || error.error?.message || error.message || '';
    const tableMatch = errorMessage.match(/table "(.+?)"/);
    const tableName = tableMatch ? tableMatch[1] : 'unknown table';

    return {
      message: `Cannot delete product because it is referenced in ${tableName}`,
      tableName: tableName
    };
  }

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