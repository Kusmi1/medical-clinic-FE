import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
const host8080 = 'http://localhost:8080';
const AWS = environment.baseUrl;
// const AWS = 'http://medical-clinic-3.eu-north-1.elasticbeanstalk.com';

const AUTH_API = `${AWS}/api/auth/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    pesel: string,
    password: string,
    secondName?: string
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        firstName,
        lastName,
        userName,
        email,
        pesel,
        password,
        secondName,
      },
      httpOptions
    );
  }
}
