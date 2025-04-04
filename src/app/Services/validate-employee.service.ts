import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidateEmployeeService {
  private apiUrl = 'http://localhost:5134/api/validation';
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private http: HttpClient) { }

  validateEmployee(pl_matric: number, pl_nom: string, pl_prenom: string): Observable<number> {
    const params = new HttpParams()
      .set('pl_matric', pl_matric.toString())
      .set('pl_nom', pl_nom)
      .set('pl_prenom', pl_prenom);

    return this.http.get<number>(`${this.apiUrl}/ValidateEmployee`, { params }).pipe(
      tap(result => {
        this.isLoggedIn.next(result === 1);
      }),
      catchError(error => {
        console.error('Validation error:', error);
        this.isLoggedIn.next(false);
        throw error;
      })
    );
  }

  logout() {
    this.isLoggedIn.next(false);
  }
}