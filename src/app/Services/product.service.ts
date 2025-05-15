import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface DropdownOptions {
  lignes: string[];
  famille: string[];
  sousFamilles: string[];
  types: string[];
  statuts: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5201/api/Products';

  constructor(private http: HttpClient) { }

  getDropdownOptions(): Observable<DropdownOptions> {
    return this.http.get<DropdownOptions>(`${this.apiUrl}/GetOptions`);
  }

  createProduct(productData: any): Observable<any> {
    const formData = new FormData();

    // Required fields
    formData.append('Ligne', productData.ligne || '');
    formData.append('Famille', productData.famille || '');
    formData.append('Sous-Famille', productData.sousFamille || '');
    formData.append('Code Produit', productData.codeProduit || '');
    formData.append('Libellé', productData.libelle || '');
    formData.append('Serialisé', String(productData.isSerialized));

    // Require GalliaName
    if (!productData.galliaName) {
      return throwError(() => ({
        Result: 'Error',
        Message: 'Le champ "GalliaName" est requis.'
      }));
    }
    formData.append('GalliaName', productData.galliaName);

    // Optional fields
    if (productData.type) formData.append('Type', productData.type);
    if (productData.libelle2) formData.append('Libellé 2', productData.libelle2);
    if (productData.statut) formData.append('Statut', productData.statut);
    if (productData.codeProduitClientC264)
      formData.append('Code Client (C264)', productData.codeProduitClientC264);
    if (productData.poids !== undefined && productData.poids !== null)
      formData.append('Poids (kg)', productData.poids.toString());
    if (productData.createur)
      formData.append('Créé par', productData.createur);
    if (productData.dateCreation)
      formData.append('Date Création', productData.dateCreation);
    if (productData.tolerance)
      formData.append('Tolerance', productData.tolerance);
    if (productData.flashable !== undefined && productData.flashable !== null)
      formData.append('Flashable', productData.flashable.toString());

    return this.http.post<any>(`${this.apiUrl}/CreateProduct`, formData).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(productData: any): Observable<any> {
    const formData = new FormData();

    // Required field
    formData.append('Code Produit', productData.codeProduit || '');

    // Require GalliaName
    if (!productData.galliaName) {
      return throwError(() => ({
        Result: 'Error',
        Message: 'Le champ "GalliaName" est requis.'
      }));
    }
    formData.append('GalliaName', productData.galliaName);

    // Optional fields
    if (productData.ligne) formData.append('Ligne', productData.ligne);
    if (productData.famille) formData.append('Famille', productData.famille);
    if (productData.sousFamille) formData.append('Sous-Famille', productData.sousFamille);
    if (productData.libelle) formData.append('Libellé', productData.libelle);
    if (productData.isSerialized !== undefined)
      formData.append('Serialisé', String(productData.isSerialized));
    if (productData.type) formData.append('Type', productData.type);
    if (productData.libelle2) formData.append('Libellé 2', productData.libelle2);
    if (productData.statut) formData.append('Statut', productData.statut);
    if (productData.codeProduitClientC264)
      formData.append('Code Client (C264)', productData.codeProduitClientC264);
    if (productData.poids !== undefined && productData.poids !== null)
      formData.append('Poids (kg)', productData.poids.toString());
    if (productData.createur)
      formData.append('Créé par', productData.createur);
    if (productData.tolerance)
      formData.append('Tolerance', productData.tolerance);
    if (productData.flashable !== undefined && productData.flashable !== null)
      formData.append('Flashable', productData.flashable.toString());

    return this.http.put<any>(`${this.apiUrl}/UpdateProduct`, formData).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(ptNum: string): Observable<ProductResult> {
    return this.http.delete<ProductResult>(`${this.apiUrl}/DeleteProduct/${ptNum}`).pipe(
      map((response: any) => ({
        Result: response.result || response.Result,
        Message: response.message || response.Message,
        ProductCode: response.productCode || response.ProductCode
      })),
      catchError(this.handleError)
    );
  }

  getProducts(CodeProduit?: string, status?: string, isSerialized?: boolean): Observable<ProductResult> {
    let params = new HttpParams();

    if (CodeProduit) params = params.set('CodeProduit', CodeProduit);
    if (status) params = params.set('status', status);
    if (isSerialized !== undefined) params = params.set('isSerialized', isSerialized.toString());

    return this.http.get<any>(`${this.apiUrl}/GetProduct`, { params }).pipe(
      map((response: any) => {
        const productsArray = response.products?.products || response.Products || response.products || [];

        const mappedProducts = productsArray.map((product: any) => ({
          PtNum: product.PtNum || product.ptNum || product.CodeProduit,
          PtLib: product.PtLib || product.ptLib || product.Libellé,
          FpCod: product.FpCod || product.fpCod || product.Famille,
          SpCod: product.SpCod || product.spCod || product.SousFamille,
          SpId: product.SpId || product.spId || product.Status,
          IsSerialized: product.IsSerialized || product.isSerialized || false,
          PtPoids: product.PtPoids || product.ptPoids || product.Poids,
          PtDcreat: product.PtDcreat || product.ptDcreat || product.DateCreation,
          GalliaName: product.GalliaName || product.galliaName || null
        }));

        return {
          Result: response.result || response.Result || 'Success',
          Message: response.message || response.Message || 'Products retrieved successfully',
          ProductCode: response.productCode || response.ProductCode,
          Products: mappedProducts,
          IsSerialized: response.isSerialized || response.IsSerialized
        };
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.error?.Message || error.message;
    }
    return throwError(() => ({
      Result: 'Error',
      Message: errorMessage
    }));
  }
}

// Interfaces

export interface CreateProductFormData {
  Ligne: string;
  Famille: string;
  SousFamille: string;
  CodeProduit: string;
  Libelle: string;
  IsSerialized: boolean;
  GalliaName: string;
  Type?: string;
  Libelle2?: string;
  Statut?: string;
  CodeProduitClientC264?: string;
  Poids?: number;
  Createur?: string;
  DateCreation?: Date;
  Tolerance?: string;
  Flashable?: number;
}

export interface ProductOptionResponse {
  Lignes: string[];
  Famille: string[];
  SousFamilles: string[];
  Types: string[];
  Statuts: string[];
}

export interface ProductResult {
  Result: string;
  Message: string;
  ProductCode?: string;
  Products?: ProduitSerialiséDto[];
  IsSerialized?: boolean;
}

export interface ProduitSerialiséDto {
  PtNum: string;
  PtLib: string;
  FpCod: string;
  SpCod: string;
  SpId: string;
  IsSerialized: boolean;
  PtPoids: number | null;
  PtDcreat: Date | null;
  TpCod?: string | null;
  PtLib2?: string | null;
  PtSpecifT14?: string | null;
  PtCreateur?: string | null;
  PtSpecifT15?: string | null;
  PtFlasher?: number | null;
  GalliaName?: string | null;
}
