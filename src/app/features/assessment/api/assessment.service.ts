import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, take} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {
  Assessment,
  GetAssessmentsRequestProps,
  GetEvaluatorsIdsRequestProps, StartAssessmentRequestProps,
  UpdateEvaluatorsIdsRequestProps
} from '../store/assessment.model';

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

  getAssessments({isActive}: GetAssessmentsRequestProps): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${environment.apiGatewayUrl}/api/assessments?isActive=${isActive}`).pipe(
      take(1),
      map(assessments => assessments.map(assessment => ({
        ...assessment,
        startAt: new Date(assessment.startAt),
        endsAt: new Date(assessment.endsAt),
      })))
    )
  }

  startAssessment(data: StartAssessmentRequestProps) {
    return this.http.post(`${environment.apiGatewayUrl}/api/assessments`, data)
  }

  deleteAssessment(assessmentId: string) {
    return this.http.delete(`${environment.apiGatewayUrl}/api/assessments/${assessmentId}`)
  }
}
