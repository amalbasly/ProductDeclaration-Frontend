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
      tap(options => console.debug('Dropdown options received:', options)),
      catchError(this.handleError<DropdownOptions>('getDropdownOptions'))
    );
  }

  checkProductCode(code: string): Observable<{ exists: boolean }> {
    if (!code) {
      return throwError(() => new Error('Product code is required'));
    }

    return this.http.get<{ exists: boolean }>(
      `${this.apiUrl}/CheckProductCode?code=${encodeURIComponent(code)}`
    ).pipe(
      catchError(this.handleError<{ exists: boolean }>('checkProductCode'))
    );
  }

  createProduct(productData: any): Observable<ProductCreateResponse> {
    if (!productData) {
      return throwError(() => new Error('Product data is required'));
    }

    const params = new HttpParams({ fromObject: this.sanitizeProductData(productData) });

    return this.http.post<ProductCreateResponse>(
      `${this.apiUrl}/CreateProduct`,
      {},
      { params }
    ).pipe(
      catchError(this.handleError<ProductCreateResponse>('createProduct'))
    );
  }

  private sanitizeProductData(data: any): { [key: string]: string } {
    return {
      ligne: data.ligne || '',
      famille: data.famille || '',
      sousFamille: data.sousFamille || '',
      codeProduit: data.codeProduit || '',
      libelle: data.libelle || '',
      type: data.type || '',
      libelle2: data.libelle2 || '',
      statut: data.statut || '',
      codeProduitClientC264: data.codeProduitClientC264 || '',
      poids: data.poids?.toString() || '0',
      createur: data.createur || '',
      dateCreation: data.dateCreation || new Date().toISOString(),
      tolerance: data.tolerance || '',
      flashable: data.flashable?.toString() || 'false'
    };
  }

  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);

      let errorMessage = 'An unknown error occurred';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        
        if (error.error?.Message) {
          errorMessage = error.error.Message;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error) {
          errorMessage = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
        }
      }

      return throwError(() => ({
        Result: 'Error',
        Message: errorMessage,
        ...(operation === 'getProducts' ? { Products: [] } : {})
      }));
    };
  }
}