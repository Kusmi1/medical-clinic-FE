import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { MedicalClinic, VisitDetails, VisitModel } from '../../models/visit.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenStorageService } from '../auth/token-storage.service';
import { SpecializationModel } from '../../models/specialization.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorModel } from '../../models/doctor.model';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../environments/environment';

const host8080 = 'http://localhost:8080';
const AWS = environment.baseUrl;
// const AWS = 'http://medical-clinic-3.eu-north-1.elasticbeanstalk.com';

const VISIT_API = `${AWS}/api/visit`;

const USER_API = `${AWS}/api/user`;
const DOCTOR_API = `${AWS}/api/doctor`;
const VISIT_DETAILS_API = `${AWS}/api/visit-details`;
const USERACCOUNT_API = `${AWS}/api/useraccount`;
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

  getAllUsersByRole(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${USER_API}/allByRole`);
  }

  getUser(): Observable<UserModel> {
    const userId = this.tokenStorageService.getUserId();
    return this.http.get<UserModel>(`${USER_API}/${userId}`);
  }

  UpdateUser(userData: any): Observable<any> {
    const userId = this.tokenStorageService.getUserId();
    const url = `${USER_API}/add/${userId}`;
    return this.http.put(url, userData);
  }

  deleteUser(): Observable<any> {
    const userId = this.tokenStorageService.getUserId();
    const url = `${USER_API}/delete/${userId}`;
    return this.http.delete(url, httpOptionsString);
  }

  getAllMedicalClinics(): Observable<MedicalClinic[]> {
    const url = `${AWS}/api/medicalClinics/all-clinics`;
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
    const url = `${AWS}/api/specialization`;
    // const url = 'http://localhost:8080/api/specialization';
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
    doctorId: string,
    startHour: string,
    endHour: string,
    stepHour: string,
    price: number,
    clinicId: number
  ): Observable<any> {
    const url = `${VISIT_API}/add-visit`;
    const params = new HttpParams()
      .set('visitDate', visitDate)
      .set('doctorId', doctorId)
      .set('startHour', startHour)
      .set('endHour', endHour)
      .set('stepHour', stepHour)
      .set('price', price)
      .set('clinicId', clinicId);

    const httpOptionsParams = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: params,
      responseType: 'text' as 'json',
    };

    return this.http.post<string>(url, null, httpOptionsParams);
  }

  getAllFutureBookedVisits(doctorId?: string, userId?: string): Observable<any> {
    const url = `${VISIT_API}/all-future-visits`;

    let params = new HttpParams();

    if (userId !== undefined && userId !== null) {
      params = params.set('userId', userId);
    }

    if (doctorId !== undefined && doctorId !== null) {
      params = params.set('doctorId', doctorId);
    }

    return this.http.get<any>(url, { params }).pipe(
      catchError(error => {
        console.error('Error fetching visits:', error);
        return of([]);
      })
    );
  }
  addVisitDetails(visitId: string, visitDetailsDto: VisitDetails): Observable<any> {
    return this.http.post(`${VISIT_DETAILS_API}/add/${visitId}`, visitDetailsDto);
  }
  getVisitDetailsByVisitId(visitId: string): Observable<VisitDetails> {
    return this.http.get<VisitDetails>(`${VISIT_DETAILS_API}/${visitId}`);
  }

  changeUserRoleAndHandleDoctor(
    userId: string,
    newRole: string,
    specializationIds: number[] | null
  ): Observable<any> {
    let url = `${USER_API}/change-role/${userId}?newRole=${newRole}`;
    if (newRole === 'ROLE_DOCTOR' && specializationIds) {
      url += `&specializationIds=${specializationIds}`;
    }

    return this.http.put(url, {}, httpOptionsString);
  }

  addBalance(balance: number, userId: string) {
    const params = new HttpParams().set('balance', balance);

    const httpOptionsParams = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: params,
      responseType: 'text' as 'json',
    };
    const url = `${USERACCOUNT_API}/setbalance/${userId}`;
    return this.http.put<string>(url, null, httpOptionsParams);
  }
}
