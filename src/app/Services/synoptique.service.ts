import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of ,map} from 'rxjs';
import { catchError, concatMap, toArray } from 'rxjs/operators';

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
  deletedEntries?: number;
  insertedEntries?: number;
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
    return this.http.post<SynoptiqueSaveResult>(this.apiUrl, request).pipe(
      catchError(this.handleError)
    );
  }

  updateSynoptique(request: SynoptiqueSaveRequest): Observable<SynoptiqueSaveResult> {
    if (!request.entries.length) {
      return of({
        success: false,
        message: 'No entries to update',
        productCode: request.ptNum
      } as SynoptiqueSaveResult);
    }

    return of(request.entries).pipe(
      concatMap(entries => entries),
      concatMap(entry =>
        this.http.put<SynoptiqueUpdateResult>(`${this.apiUrl}/update_synoptique`, {
          modeID: entry.modeID,
          ptNum: request.ptNum,
          nomMvt: entry.nomMvt,
          ordre: entry.ordre,
          matricule: request.matricule ?? 'SYSTEM'
        } as SynoptiqueUpdateRequest).pipe(
          catchError(err => of({
            success: false,
            message: err.message || 'Failed to update entry',
            productCode: request.ptNum
          } as SynoptiqueUpdateResult))
        )
      ),
      toArray(),
      map(results => {
        const allSuccessful = results.every(result => result.success);
        return {
          success: allSuccessful,
          message: allSuccessful ? 'Synoptique updated successfully' : 'Some entries failed to update',
          productCode: request.ptNum,
          insertedEntries: allSuccessful ? results.length : 0
        } as SynoptiqueSaveResult;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'Server error occurred. Please try again later.';
    
    if (error.status === 405) {
      errorMessage = 'Method not allowed. Please check the API endpoint configuration.';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}