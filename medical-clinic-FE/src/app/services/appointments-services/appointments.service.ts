import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalClinic, VisitDetails, VisitModel } from '../../models/visit.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenStorageService } from '../auth/token-storage.service';
import { SpecializationModel } from '../../models/specialization.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorModel } from '../../models/doctor.model';
import { UserModel } from '../../models/book-visit.model';

const VISIT_API = 'http://localhost:8080/api/visit';
const USER_API = 'http://localhost:8080/api/user';
const DOCTOR_API = 'http://localhost:8080/api/doctor';
const VISIT_DETAILS_API = 'http://localhost:8080/api/visit-details';
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
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${USER_API}/all`);
  }

  getUser(): Observable<UserModel> {
    const userId = this.tokenStorageService.getUserId();
    return this.http.get<UserModel>(`${USER_API}/${userId}`);
  }
  getAllMedicalClinics(): Observable<MedicalClinic[]> {
    const url = 'http://localhost:8080/api/medicalClinics/all-clinics';
    return this.http.get<MedicalClinic[]>(url);
  }
  getPastBookedVisits(): Observable<VisitModel[]> {
    const userId = this.tokenStorageService.getUserId();
    return this.http.get<VisitModel[]>(`${VISIT_API}/past-visit/user/${userId}`, httpOptions);
  }

  getFutureBookedVisits(): Observable<VisitModel[]> {
    const userId = this.tokenStorageService.getUserId();
    return this.http.get<VisitModel[]>(`${VISIT_API}/future-visit/user/${userId}`, httpOptions);
  }

  getAvailableVisitsBySpecialization(
    specializationName: string,
    date?: string
  ): Observable<VisitModel[]> {
    let params = new HttpParams();
    if (date) {
      params = params.append('visitDate', date);
    }

    const url = `${VISIT_API}/${specializationName}`;
    return this.http.get<VisitModel[]>(url, { params });
  }

  getAllSpecializations(): Observable<SpecializationModel[]> {
    const url = 'http://localhost:8080/api/specialization';
    return this.http.get<SpecializationModel[]>(url, httpOptions);
  }

  getVisitById(visitId: string): Observable<any> {
    const url = `${VISIT_API}/byId/${visitId}`;
    return this.http.get<VisitModel[]>(url);
  }

  bookVisit(visitId: string): Observable<string> {
    const userId = this.tokenStorageService.getUserId();
    const url = `${VISIT_API}/visitId/${visitId}/user/${userId}`;
    return this.http.post<string>(url, null, httpOptionsString);
  }

  deleteVisit(visitId: string): Observable<any> {
    const url = `${VISIT_API}/visitId/${visitId}`;
    return this.http.put(url, null, httpOptionsString);
  }

  getDoctorsBySpecialization(specializationName: string): Observable<DoctorModel[]> {
    const url = `${DOCTOR_API}/specialization/${specializationName}`;
    return this.http.get<DoctorModel[]>(url);
  }

  addVisit(
    visitDate: string,
    doctorId: number,
    hours: string,
    price: number,
    clinicId: number
  ): Observable<any> {
    const url = `${VISIT_API}/add-visit`;
    const params = new HttpParams()
      .set('visitDate', visitDate)
      .set('doctorId', doctorId)
      .set('hours', hours)
      .set('price', price)
      .set('clinicId', clinicId);

    const httpOptionsParams = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: params,
      responseType: 'text' as 'json',
    };

    return this.http.post<string>(url, null, httpOptionsParams);
  }

  getAllFutureBookedVisits(doctorId?: number, userId?: number): Observable<any> {
    const url = `${VISIT_API}/all-future-visits`;

    let params = new HttpParams();

    if (userId !== undefined && userId !== null) {
      console.log('userId ', userId);
      params = params.set('userId', userId!.toString());
    }

    if (doctorId !== undefined && doctorId !== null) {
      params = params.set('doctorId', doctorId!.toString());
    }

    return this.http.get<any>(url, { params });
  }

  addVisitDetails(visitId: string, visitDetailsDto: VisitDetails): Observable<any> {
    return this.http.post(`${VISIT_DETAILS_API}/add/${visitId}`, visitDetailsDto);
  }
  getVisitDetailsByVisitId(visitId: string): Observable<VisitDetails> {
    return this.http.get<VisitDetails>(`${VISIT_DETAILS_API}/${visitId}`);
  }
}
