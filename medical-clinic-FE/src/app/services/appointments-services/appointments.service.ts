import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VisitModel } from '../../models/visit.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';

const AUTH_API = 'http://localhost:8080/api/visit';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
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

  getAvailableVisitsBySpecialization(specializationName: string): Observable<VisitModel[]> {
    const url = `${AUTH_API}/${specializationName}`;
    return this.http.get<VisitModel[]>(url);
  }
}
