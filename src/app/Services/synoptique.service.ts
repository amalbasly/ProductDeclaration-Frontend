import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Mode {
  id: number;
  nomMode: string;
}

export interface SynoptiqueEntry {
  modeID: number;
  ptNum: string;
  nomMvt: string;
  ordre: number;
  matricule?: string;
}

export interface SynoptiqueSaveRequest {
  ptNum: string;
  matricule?: string;
  entries: SynoptiqueEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class SynoptiqueService {
  private apiUrl = 'http://localhost:5134/api/Synoptique';

  constructor(private http: HttpClient) {}

  getAllModes(): Observable<Mode[]> {
    return this.http.get<Mode[]>(`${this.apiUrl}/modes`).pipe(
      catchError(this.handleError)
    );
  }

  getSynoptiqueForProduct(ptNum: string): Observable<SynoptiqueEntry[]> {
    return this.http.get<SynoptiqueEntry[]>(`${this.apiUrl}/${ptNum}`).pipe(
      catchError(this.handleError)
    );
  }

  saveSynoptique(request: SynoptiqueSaveRequest): Observable<any> {
    return this.http.post('http://localhost:5134/api/Synoptique', request).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
  
    if (error.error && error.error.Message) {
      // Return the detailed backend error
      return throwError(() => new Error(error.error.Message));
    } else {
      // Fallback generic message
      return throwError(() => new Error('Operation failed. Please try again.'));
    }
  }
  
}