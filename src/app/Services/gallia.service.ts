import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateGalliaDto, UpdateGalliaDto,LabelImageDto } from '../models/GalliaDto';
import { GalliaDto } from '../models/GalliaDto';

@Injectable({ providedIn: 'root' })
export class GalliaService {
  private apiUrl = 'http://localhost:5201/api/Gallia';

  constructor(private http: HttpClient) {}

  getAllGallias(): Observable<GalliaDto[]> {
    return this.http.get<GalliaDto[]>(`${this.apiUrl}/GetAll`);
  }

  getGalliaById(id: number): Observable<GalliaDto> {
    return this.http.get<GalliaDto>(`${this.apiUrl}/${id}`);
  }

  createGallia(dto: CreateGalliaDto): Observable<GalliaDto> {
    return this.http.post<GalliaDto>(`${this.apiUrl}/Create`, dto);
  }

  updateGallia(dto: UpdateGalliaDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/Update/${dto.galliaId}`, dto);
  }

  deleteGallia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Delete/${id}`);
  }

  saveLabelImage(dto: LabelImageDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-image`, dto);
  }
}