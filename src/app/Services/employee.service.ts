import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' 
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5134/api/Employee';

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<PersonnelTracaDto[]> {
    return this.http.get<PersonnelTracaDto[]>(`${this.apiUrl}/Read_All_Employees`).pipe(
      catchError(error => {
        console.error('Error fetching employees:', error);
        return of([]); 
      })
    );
  }

  updateEmployee(pl_matric: number, pl_fonc: string): Observable<any> {
    const params = new HttpParams()
      .set('pl_matric', pl_matric.toString())
      .set('pl_fonc', pl_fonc);

    return this.http.put(`${this.apiUrl}/UpdateEmployee`, null, { params })
      .pipe(
        catchError(error => {
          if (error.status === 404 || error.status === 200) {
            return of({ success: true });
          }
          return throwError(() => error);  
        })
      );
  }

  addEmployee(employee: EmployeeData): Observable<any> {
    const params = new HttpParams()
      .set('pl_nom', employee.pl_nom)
      .set('pl_prenom', employee.pl_prenom)
      .set('pl_badge', employee.pl_badge.toString())
      .set('pl_fonc', employee.pl_fonc)
      .set('img', employee.img)
      .set('descriptionGrp', employee.descriptionGrp);
  
    return this.http.post(`${this.apiUrl}/AddEmployee`, null, { params });
  }

  deleteEmployee(options: {
    pl_matric?: number;
    pl_nom?: string;
    pl_prenom?: string;
  }): Observable<{ message: string }> {
    let params = new HttpParams();
    
    if (options.pl_matric) {
      params = params.set('pl_matric', options.pl_matric.toString());
    } else {
      params = params
        .set('pl_nom', options.pl_nom || '')
        .set('pl_prenom', options.pl_prenom || '');
    }
  
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/DeleteEmployee`, 
      { params }
    );
  }

  getEmployeeDetails(matricule: number): Observable<PersonnelTracaDto> {  
    return this.http.get<PersonnelTracaDto>(`${this.apiUrl}/GetEmployeeByMatricule/${matricule}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching employee:', error);
          return throwError(() => error);  
        })
      );
  }
}

interface EmployeeData {
  pl_nom: string;
  pl_prenom: string;
  pl_badge: number;
  pl_fonc: string;
  img: string;
  descriptionGrp: string;
}

export interface PersonnelTracaDto {
  pl_matric: number;
  pl_badge: number;
  pl_nom: string;
  pl_prenom: string;
  pl_fonc: string;
  idGrp: number;
  img: string;
  Groupe?: {
    IDGrp: number;
    descriptionGrp: string;
  };
}

export type EmployeeDetails = PersonnelTracaDto;