import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VisitModel } from '../../models/visit.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenStorageService } from '../auth/token-storage.service';
import { SpecializationModel } from '../../models/specialization.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const AUTH_API = 'http://localhost:8080/api/visit';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const httpOptionsString = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  responseType: 'text' as 'json',
};
@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  visitId = 0;
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getPastBookedVisits(): Observable<VisitModel[]> {
    const userId = this.tokenStorageService.getUserId();
    return this.http.get<VisitModel[]>(`${AUTH_API}/past-visit/user/${userId}`, httpOptions);
  }

  getFutureBookedVisits(): Observable<VisitModel[]> {
    const userId = this.tokenStorageService.getUserId();
    return this.http.get<VisitModel[]>(`${AUTH_API}/future-visit/user/${userId}`, httpOptions);
  }

  getAvailableVisitsBySpecialization(
    specializationName: string,
    date?: string
  ): Observable<VisitModel[]> {
    let params = new HttpParams();
    if (date) {
      params = params.append('visitDate', date);
    }

    const url = `${AUTH_API}/${specializationName}`;
    return this.http.get<VisitModel[]>(url, { params });
  }

  getAllSpecializations(): Observable<SpecializationModel[]> {
    const url = 'http://localhost:8080/api/specialization';
    return this.http.get<SpecializationModel[]>(url, httpOptions);
  }

  getVisitById(visitId: number): Observable<any> {
    const url = `${AUTH_API}/byId/${visitId}`;
    return this.http.get<VisitModel[]>(url);
  }

  bookVisit(visitId: number): Observable<string> {
    const userId = this.tokenStorageService.getUserId();
    const url = `${AUTH_API}/visitId/${visitId}/user/${userId}`;
    return this.http.post<string>(url, null, httpOptionsString);
  }

  deleteVisit(visitId: number): Observable<any> {
    const url = `${AUTH_API}/visitId/${visitId}`;
    return this.http.put(url, null, httpOptionsString);
  }
}
