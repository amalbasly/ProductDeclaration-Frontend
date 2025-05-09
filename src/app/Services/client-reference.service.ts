import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientReference {
  ptNum: string;
  clientReference: string;
  clientIndex: string;
  client: string;
  referentiel: string;
  isSerialized: boolean;
}

export interface CreateReferenceDto {
  clientReference: string;
  clientIndex: string;
  client: string;
  referentiel: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientReferenceService {
  private apiUrl = 'http://localhost:5201/api/ClientReferences';

  constructor(private http: HttpClient) { }

  getReference(ptNum: string): Observable<ClientReference> {
    return this.http.get<ClientReference>(`${this.apiUrl}/${ptNum}`);
  }

  createReference(ptNum: string, dto: CreateReferenceDto): Observable<ClientReference> {
    return this.http.post<ClientReference>(`${this.apiUrl}/${ptNum}`, dto);
  }

  updateReference(ptNum: string, dto: CreateReferenceDto): Observable<ClientReference> {
    return this.http.put<ClientReference>(`${this.apiUrl}/${ptNum}`, dto);
  }

  deleteReference(ptNum: string): Observable<{ success: boolean, message: string }> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.apiUrl}/${ptNum}`);
  }
  getByPtNumAsync(ptNum: string): Observable<ClientReference> {
    return this.http.get<ClientReference>(`${this.apiUrl}/${ptNum}`);
  }
}