import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { 
  CreateGalliaDto, 
  UpdateGalliaDto,
  LabelImageDto,
  GalliaDto 
} from '../models/GalliaDto';

@Injectable({ providedIn: 'root' })
export class GalliaService {
  private apiUrl = 'http://localhost:5201/api/Gallia';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  getAllGallias(): Observable<GalliaDto[]> {
    return this.http.get<GalliaDto[]>(`${this.apiUrl}/GetAll`).pipe(
      map(gallias => gallias.map(g => this.sanitizeGalliaImage(g)))
    );
  }

  getGalliaById(id: number): Observable<GalliaDto> {
    return this.http.get<GalliaDto>(`${this.apiUrl}/${id}`).pipe(
      map(gallia => this.sanitizeGalliaImage(gallia))
    );
  }

  createGallia(dto: CreateGalliaDto): Observable<GalliaDto> {
    return this.http.post<GalliaDto>(`${this.apiUrl}/Create`, dto);
  }

  updateGallia(dto: UpdateGalliaDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/Update/${dto.galliaId}`, dto);
  }

  deleteGallia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Delete/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  saveLabelImage(dto: LabelImageDto): Observable<any> {
    const payload = {
      galliaId: dto.galliaId,
      base64Image: dto.base64Image,
      savePath: dto.savePath
    };

    return this.http.post(`${this.apiUrl}/save-image`, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  private sanitizeGalliaImage(gallia: GalliaDto): GalliaDto {
    return {
      ...gallia,
      labelImage: gallia.labelImage ? this.sanitizeImage(gallia.labelImage as string) : undefined
    };
  }

  private sanitizeImage(base64: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${base64}`);
  }
}
