import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {GetEvaluatorsIdsRequestProps, UpdateEvaluatorsIdsRequestProps} from '../store/assessment.model';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private http = inject(HttpClient);

  getEvaluatorsIds({userId}: GetEvaluatorsIdsRequestProps): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiGatewayUrl}/api/assessments/evaluators/${userId}`)
  }

  updateEvaluatorsIds({userId, evaluatorIds}: UpdateEvaluatorsIdsRequestProps): Observable<object> {
    return this.http.put(`${environment.apiGatewayUrl}/api/assessments/evaluators/${userId}`, {
      evaluatorIds
    })
  }
}
