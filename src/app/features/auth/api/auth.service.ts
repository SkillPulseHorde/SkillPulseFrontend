import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {LoginRequestProps, LoginResponse, RegisterRequestProps} from '../store/auth.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  register(props: RegisterRequestProps): Observable<object> {
    return this.http.post(`${environment.apiGatewayUrl}/api/auth/register`, props).pipe()
  }

  login(props: LoginRequestProps): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiGatewayUrl}/api/auth/login`, props).pipe()
  }

  logout(): void {
    this.http.post(`${environment.apiGatewayUrl}/api/auth/logout`, {})
  }
}
