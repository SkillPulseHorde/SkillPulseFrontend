import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../../environments/environment';
import {GetUserRequestProps, GetUserResponse} from '../store/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getUserById({userId} : GetUserRequestProps): Observable<GetUserResponse> {
    return this.http.get<GetUserResponse>(`${environment.apiGatewayUrl}/api/users/${userId}`).pipe()
  }
}
