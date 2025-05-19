import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateAssemblageDto {
  nomAssemblage: string;
  mainProduitPtNum: string;
  galliaName: string; // Changed from labelName
  secondaryProduitPtNums: string[];
}

export interface UpdateAssemblageDto {
  nomAssemblage: string;
  mainProduitPtNum: string;
  galliaName: string; // Changed from labelName
  secondaryProduitPtNums: string[];
}

export interface SecondaryProduitDto {
  ptNum: string;
}

export interface AssemblageDto {
  assemblageId: number;
  nomAssemblage: string;
  mainProduitPtNum: string;
  galliaName: string; // Changed from labelName
  secondaryProduits: SecondaryProduitDto[];
}

@Injectable({
  providedIn: 'root'
})
export class AssemblageService {
  private apiUrl = 'http://localhost:5201/api/Assemblage';

  constructor(private http: HttpClient) { }

  createAssemblage(dto: CreateAssemblageDto): Observable<{ assemblageId: number }> {
    return this.http.post<{ assemblageId: number }>(`${this.apiUrl}/Create_Assemblage`, dto);
  }

  getAssemblageById(id: number): Observable<AssemblageDto> {
    return this.http.get<AssemblageDto>(`${this.apiUrl}/Get_Assemblage_by/${id}`);
  }

  getAllAssemblages(): Observable<AssemblageDto[]> {
    return this.http.get<AssemblageDto[]>(`${this.apiUrl}/Get_Assemblage`);
  }

  updateAssemblage(id: number, dto: UpdateAssemblageDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  deleteAssemblage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}