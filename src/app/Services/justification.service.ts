import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface JustificationResponse {
  justificationID: number;
  productCode: string;
  status: string;
  submissionDate: string;
  message: string;
}

interface JustificationDto {
  JustificationID: number;
  ProductCode: string;
  ProductName?: string;
  JustificationText?: string;
  UrgencyLevel?: string;
  Status?: string;
  SubmittedBy?: string;
  SubmissionDate: Date;
  DecisionComments?: string;
  DecisionDate?: Date;
  DecidedBy?: string;
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

  getJustifications(productCode?: string, status?: string, submittedBy?: string): Observable<JustificationDto[]> {
    let params = new HttpParams();
    if (productCode) params = params.set('ProductCode', productCode);
    if (status) params = params.set('Status', status);
    if (submittedBy) params = params.set('SubmittedBy', submittedBy);
    return this.http.get<JustificationDto[]>(this.apiUrl, { params });
  }
}