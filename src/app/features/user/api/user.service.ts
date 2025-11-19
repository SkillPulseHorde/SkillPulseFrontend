import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {GetUserRequestProps, GetUserResponse, GetUsersRequestProps, Reviewer, User} from '../store/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getUserById({userId}: GetUserRequestProps): Observable<GetUserResponse> {
    return this.http.get<GetUserResponse>(`${environment.apiGatewayUrl}/api/users/${userId}`)
  }

  getUsers({userId}: GetUsersRequestProps): Observable<Reviewer[]> {
    return this.http.get<Reviewer[]>(`${environment.apiGatewayUrl}/api/users?currentUserId=${userId}`)
  }
}
