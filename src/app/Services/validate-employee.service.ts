import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  pl_matric: number;
  pl_nom: string;
  pl_prenom: string;
  employeeFunction: string;
  accessStatus: number;
  employeeEmail: string;
  profileImage?: string;
}

@Injectable({ providedIn: 'root' })
export class ValidateEmployeeService {
  private apiUrl = 'http://localhost:5201/api/validation';
  public currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  validateEmployee(pl_matric: number, pl_nom: string, pl_prenom: string): Observable<User | null> {
    const params = new HttpParams()
      .set('pl_matric', pl_matric.toString())
      .set('pl_nom', pl_nom)
      .set('pl_prenom', pl_prenom);

    return this.http.get<User>(`${this.apiUrl}/ValidateEmployee`, { params }).pipe(
      tap(user => {
        if (user && user.pl_matric) {
          console.log('✅ Login successful - storing user:', user);
          this.currentUser$.next({
            ...user,
            pl_nom: user.pl_nom || pl_nom,
            pl_prenom: user.pl_prenom || pl_prenom
          });
        } else {
          console.warn('⚠️ Invalid user response:', user);
          this.currentUser$.next(null);
        }
      }),
      catchError(error => {
        console.error('❌ Validation error:', error);
        this.currentUser$.next(null);
        return of(null);
      })
    );
  }

  // ✅ Add this method to access the current user
  getCurrentUser(): User | null {
    return this.currentUser$.value;
  }

  logout(): void {
    this.currentUser$.next(null);
  }
}