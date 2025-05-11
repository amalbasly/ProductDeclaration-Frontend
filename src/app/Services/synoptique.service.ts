import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ModeDto {
  id: number;
  nomMode: string;
}

export interface SynoptiqueEntryDto {
  modeID: number;
  ptNum: string;
  nomMvt: string;
  ordre: number;
  matricule?: string;
}

export interface SynoptiqueSaveRequest {
  ptNum: string;
  matricule?: string;
  entries: SynoptiqueEntryDto[];
}

export interface SynoptiqueUpdateRequest {
  modeID: number;
  ptNum: string;
  nomMvt: string;
  ordre: number;
  matricule?: string;
}

export interface SynoptiqueSaveResult {
  success: boolean;
  message: string;
  productCode: string;
}

export interface SynoptiqueUpdateResult {
  success: boolean;
  message: string;
  productCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class SynoptiqueService {
  private apiUrl = 'http://localhost:5201/api/Synoptique';

  constructor(private http: HttpClient) { }

  getSerializedProducts(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products`).pipe(
      catchError(this.handleError)
    );
  }

  getAllModes(): Observable<ModeDto[]> {
    return this.http.get<ModeDto[]>(`${this.apiUrl}/modes`).pipe(
      catchError(this.handleError)
    );
  }

  getSynoptiqueForProduct(ptNum: string): Observable<SynoptiqueEntryDto[]> {
    return this.http.get<SynoptiqueEntryDto[]>(`${this.apiUrl}/${ptNum}`).pipe(
      catchError(this.handleError)
    );
  }

  saveSynoptique(request: SynoptiqueSaveRequest): Observable<SynoptiqueSaveResult> {
    return this.http.post<SynoptiqueSaveResult>(`${this.apiUrl}`, request).pipe(
      catchError(this.handleError)
    );
  }

  updateSynoptiqueEntry(request: SynoptiqueUpdateRequest): Observable<SynoptiqueUpdateResult> {
    return this.http.put<SynoptiqueUpdateResult>(
      `${this.apiUrl}/update_synoptique`,
      request
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'Server error occurred. Please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Invalid request data';
          break;
        case 404:
          errorMessage = error.error?.message || 'Resource not found';
          break;
        case 500:
          errorMessage = error.error?.message || 'Internal server error';
          break;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}