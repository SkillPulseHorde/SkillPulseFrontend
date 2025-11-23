import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {GetUserRequestProps, GetUserResponse, GetUsersRequestProps, Evaluator} from '../store/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getUserById({userId}: GetUserRequestProps): Observable<GetUserResponse> {
    return this.http.get<GetUserResponse>(`${environment.apiGatewayUrl}/api/users/${userId}`)
  }

  getUsers({userId, includeCurrentUser}: GetUsersRequestProps): Observable<Evaluator[]> {
    return this.http.get<Evaluator[]>(`${environment.apiGatewayUrl}/api/users?currentUserId=${userId}&includeCurrentUser=${includeCurrentUser}`);
  }
}
