import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ProfileResponse {
  pl_nom?: string;
  pl_prenom?: string;
  img?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = 'http://localhost:5134/api/Profile';

  constructor(private http: HttpClient) {}

  getProfile(pl_matric: number): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}?pl_matric=${pl_matric}`);
  }

  updateProfile(
    pl_matric: number,
    pl_nom: string,
    pl_prenom: string,
    file: File | null
  ): Observable<any> {
    const formData = new FormData();
    formData.append('pl_nom', pl_nom);
    formData.append('pl_prenom', pl_prenom);

    if (file) {
      formData.append('img', file); // Send the actual file
    }

    return this.http.put(`${this.apiUrl}/update?pl_matric=${pl_matric}`, formData);
  }
}