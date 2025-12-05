import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, take} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {
  Assessment,
  Competence, CompetenceResult, CompletedAssessment, CompletedAssessmentData,
  DeleteAssessmentRequestProps,
  EvaluateRequestProps,
  GetActiveAssessmentsByEvaluatorRequestProps,
  GetAssessmentRequestProps, GetAssessmentResultRequestProps,
  GetAssessmentsRequestProps, GetCompetenceResultsRequestProps,
  GetCompetencesRequestProps, GetCompletedAssessmentsRequestProps,
  GetEvaluatorsIdsRequestProps,
  StartAssessmentRequestProps,
  UpdateAssessmentRequestProps,
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

  getActiveAssessmentsByEvaluator({userId}: GetActiveAssessmentsByEvaluatorRequestProps): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${environment.apiGatewayUrl}/api/assessments/evaluator/${userId}/active`).pipe(
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

  deleteAssessment({assessmentId}: DeleteAssessmentRequestProps) {
    return this.http.delete(`${environment.apiGatewayUrl}/api/assessments/${assessmentId}`)
  }

  updateAssessment({assessmentId, endsAt, evaluatorIds}: UpdateAssessmentRequestProps) {
    return this.http.put(`${environment.apiGatewayUrl}/api/assessments/${assessmentId}`, {
      endsAt,
      evaluatorIds
    })
  }

  getAssessment({assessmentId}: GetAssessmentRequestProps): Observable<Assessment> {
    return this.http.get<Assessment>(`${environment.apiGatewayUrl}/api/assessments/${assessmentId}`).pipe(
      take(1),
      map(assessment => ({
        ...assessment,
        startAt: new Date(assessment.startAt),
        endsAt: new Date(assessment.endsAt),
      }))
    )
  }

  getCompetences({evaluateeId}: GetCompetencesRequestProps) {
    return this.http.get<Competence[]>(`${environment.apiGatewayUrl}/api/assessments/competences/${evaluateeId}`)
  }

  evaluate(data: EvaluateRequestProps) {
    return this.http.post(`${environment.apiGatewayUrl}/api/assessments/evaluations`, data)
  }

  getCompletedAssessments({userId}: GetCompletedAssessmentsRequestProps): Observable<CompletedAssessment[]> {
    return this.http.get<CompletedAssessment[]>(`${environment.apiGatewayUrl}/api/assessments/evaluatee/${userId}/completed`).pipe(
      take(1),
      map(assessments => assessments.map(assessment => ({
          ...assessment,
          startAt: new Date(assessment.startAt),
          endsAt: new Date(assessment.endsAt),
        }))
      ))
  }

  getAssessmentResult({assessmentId}: GetAssessmentResultRequestProps): Observable<CompletedAssessmentData> {
    return this.http.get<CompletedAssessmentData>(`${environment.apiGatewayUrl}/api/assessments/${assessmentId}/result`)
  }

  getCompetenceResults({userId, competenceId}: GetCompetenceResultsRequestProps): Observable<CompetenceResult[]> {
    return this.http.get<CompetenceResult[]>(`${environment.apiGatewayUrl}/api/assessments/users/${userId}/competences/${competenceId}/results`).pipe(
      take(1),
      map(results => results.map(result => ({
          ...result,
          assessmentDate: new Date(result.assessmentDate),
        }))
      ))
  }
}
