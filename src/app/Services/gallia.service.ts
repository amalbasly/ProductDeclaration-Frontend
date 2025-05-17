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
  private baseUrl = 'http://localhost:5201/api/Gallia';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  getAllGallias(labelType: string): Observable<GalliaDto[]> {
    return this.http.get<GalliaDto[]>(`${this.baseUrl}/${labelType}/GetAll`).pipe(
      map(gallias => gallias.map(g => this.sanitizeGalliaImage(g)))
    );
  }

  getGalliaById(id: number, labelType: string): Observable<GalliaDto> {
    return this.http.get<GalliaDto>(`${this.baseUrl}/${labelType}/${id}`).pipe(
      map(gallia => this.sanitizeGalliaImage(gallia))
    );
  }

  createGallia(dto: CreateGalliaDto, labelType: string): Observable<GalliaDto> {
    // Ensure labelName matches the endpoint
    dto.labelName = labelType;
    return this.http.post<GalliaDto>(`${this.baseUrl}/${labelType}/Create`, dto);
  }

  updateGallia(dto: UpdateGalliaDto, labelType: string): Observable<any> {
    // Ensure labelName matches the endpoint
    dto.labelName = labelType;
    return this.http.put(`${this.baseUrl}/${labelType}/Update/${dto.galliaId}`, dto);
  }

  deleteGallia(id: number, labelType: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${labelType}/Delete/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  saveLabelImage(dto: LabelImageDto, labelType: string): Observable<any> {
    const payload = {
      galliaId: dto.galliaId,
      base64Image: dto.base64Image,
      savePath: dto.savePath
    };

    return this.http.post(`${this.baseUrl}/${labelType}/save-image`, payload, {
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
  getGalliaNames(): Observable<string[]> {
  const defaultLabelType = 'Gallia';
  return this.http.get<string[]>(`${this.baseUrl}/${defaultLabelType}/names`);
}
getLabelNames(): Observable<string[]> {
  const labelType = 'Etiquette';
  return this.http.get<string[]>(`${this.baseUrl}/${labelType}/names`).pipe(
    map(names => {
      return names.filter(name => name && name.trim() !== '');
    })
  );
}
}


