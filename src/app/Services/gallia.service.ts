import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GalliaDto , CreateGalliaDto , UpdateGalliaDto} from '../models/GalliaDto';

@Injectable({
  providedIn: 'root'
})
export class GalliaService {
  private apiUrl = 'http://localhost:5201/api/Gallia';

  constructor(private http: HttpClient) {}

  // Match the backend endpoint exactly
  getAllGallias(): Observable<GalliaDto[]> {
    return this.http.get<GalliaDto[]>(`${this.apiUrl}/Get_Gallia`);
  }

  getGalliaById(id: number): Observable<GalliaDto> {
    return this.http.get<GalliaDto>(`${this.apiUrl}/${id}`);
  }

  createGallia(gallia: CreateGalliaDto): Observable<GalliaDto> {
    return this.http.post<GalliaDto>(`${this.apiUrl}/Create_Gallia`, gallia);
  }

  updateGallia(gallia: UpdateGalliaDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${gallia.GalliaId}`, gallia);
}

  deleteGallia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
  }
}