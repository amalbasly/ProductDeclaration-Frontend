import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface JustificationResponse {
  justificationID: number;
  productCode: string;
  status: string;
  submissionDate: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class JustificationService {
  private apiUrl = 'http://localhost:5201/api/Justification';

  constructor(private http: HttpClient) { }

  submitJustification(data: {
    productCode: string;
    justificationText: string;
    urgencyLevel: string;
    submittedBy: string;
  }): Observable<JustificationResponse> {
    return this.http.post<JustificationResponse>(this.apiUrl, {
      productCode: data.productCode,
      justificationText: data.justificationText,
      urgencyLevel: data.urgencyLevel,
      submittedBy: data.submittedBy
    });
  }
}