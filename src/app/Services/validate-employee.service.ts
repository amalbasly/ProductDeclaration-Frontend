import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface User {
  pl_matric: number;
  pl_nom: string;
  pl_prenom: string;
  employeeFunction: string;
  accessStatus: number;
  employeeEmail: string;
  
}

@Injectable({ providedIn: 'root' })
export class ValidateEmployeeService {
  private apiUrl = 'http://localhost:5134/api/validation';
  public currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  validateEmployee(pl_matric: number, pl_nom: string, pl_prenom: string) {
    const params = new HttpParams()
      .set('pl_matric', pl_matric.toString())
      .set('pl_nom', pl_nom)
      .set('pl_prenom', pl_prenom);

    return this.http.get<User>(`${this.apiUrl}/ValidateEmployee`, { params }).pipe(
      tap(apiResponse => {
        if (apiResponse) {
          this.currentUser$.next({
            ...apiResponse,
            pl_nom: apiResponse.pl_nom || pl_nom,
            pl_prenom: apiResponse.pl_prenom || pl_prenom
          });
        }
      }),
      catchError(error => {
        console.error('Validation error:', error);
        return of(null);
      })
    );
  }

  logout() {
    this.currentUser$.next(null);
  }
}