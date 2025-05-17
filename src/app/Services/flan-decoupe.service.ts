import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FlanDecoupeRequest {
  ptNumOriginal: string;
  nombreDeParts: number;
  labelUtilise: string;
  utilisateur?: string;
}

export interface FlanPartieDto {
  codePartie: string;
  ptNumOriginal: string;
  numeroPartie: number;
  label: string;
  dateCreation?: Date;
}

export interface FlanDecoupeResponse {
  success: boolean;
  message?: string;
  idDecoupe: number;
  ptNumOriginal: string;
  nombreDeParts: number;
  labelUtilise: string;
  dateDecoupe: Date;
  utilisateur?: string;
  partsCount: number;
  parts: FlanPartieDto[];
}

export interface FlanDecoupeListResponse {
  success: boolean;
  message?: string;
  flanDecoupes: FlanDecoupeResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class FlanDecoupeService {
  private apiUrl = 'http://localhost:5201/api/FlanDecoupe';

  constructor(private http: HttpClient) { }

  createFlanDecoupe(request: FlanDecoupeRequest): Observable<FlanDecoupeResponse> {
    return this.http.post<FlanDecoupeResponse>(this.apiUrl, request);
  }

  getFlanDecoupes(id?: number): Observable<FlanDecoupeListResponse> {
    let params = new HttpParams();
    if (id !== undefined) {
      params = params.set('id', id.toString());
    }
    return this.http.get<FlanDecoupeListResponse>(this.apiUrl, { params });
  }

  getUncutProducts(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/uncut-products`);
  }
}