import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ValidateEmployeeService {
  private apiUrl = 'http://localhost:5134/api/validation';
  public currentUser$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  validateEmployee(pl_matric: number, pl_nom: string, pl_prenom: string) {
    const params = new HttpParams()
      .set('pl_matric', pl_matric.toString())
      .set('pl_nom', pl_nom)
      .set('pl_prenom', pl_prenom);

    return this.http.get<any>(`${this.apiUrl}/ValidateEmployee`, { params });
  }

  logout() {
    this.currentUser$.next(null);
  }
}