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

export interface SynoptiqueSaveResult {
  success: boolean;
  message: string;
  productCode: string;
  deletedEntries?: number;
  insertedEntries?: number;
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
    return this.http.post<SynoptiqueSaveResult>(this.apiUrl, request).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return throwError(() => new Error('Network error occurred. Please try again.'));
    } else {
      // Server-side error
      return throwError(() => new Error(error.error?.message || 'Server error occurred. Please try again later.'));
    }
  }
}