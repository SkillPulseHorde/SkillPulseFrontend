import {Position} from '../../user/store/user.model';

export interface GetEvaluatorsIdsRequestProps {
  userId: string;
}

export interface UpdateEvaluatorsIdsRequestProps {
  userId: string;
  evaluatorIds: string[];
}

export interface GetAssessmentsRequestProps {
  isActive: boolean;
}

export interface GetActiveAssessmentsByEvaluatorRequestProps {
  userId: string;
}

export interface StartAssessmentRequestProps {
  evaluateeId: string;
  startAt: Date;
  endsAt: Date;
  createdByUserId: string;
  evaluatorIds: string[];
}

export interface UpdateAssessmentRequestProps {
  assessmentId: string;
  endsAt: Date;
  evaluatorIds: string[];
}

export interface DeleteAssessmentRequestProps {
  assessmentId: string;
}

export interface GetAssessmentRequestProps {
  assessmentId: string;
}

export interface GetCompetencesRequestProps {
  evaluateeId: string;
}

export interface EvaluateRequestProps {
  assessmentId: string;
  evaluatorId: string;
  competenceEvaluations: CompetenceEvaluation[];
}

export interface CompetenceEvaluation {
  competenceId: string;
  criterionEvaluations: CriterionEvaluation[] | null;
  competenceComment: string | null;
}

export interface CriterionEvaluation {
  criterionId: string;
  score: number | null;
  criterionComment: string | null;
}

interface Evaluatee {
  id: string;
  fullName: string;
  position: Position;
  teamName: string;
}

export interface Assessment {
  assessmentId: string;
  startAt: Date;
  endsAt: Date;
  evaluateeInfo: Evaluatee;
  evaluatorIds: string[];
}

export interface Criteria {
  id: string;
  name: string;
  isMandatory: boolean;
}

export interface Competence {
  id: string;
  name: string;
  criteria: Criteria[];
}

export interface GetCompletedAssessmentsRequestProps {
  userId: string;
}

export interface CompletedAssessment {
  assessmentId: string;
  startAt: Date;
  endsAt: Date;
}

export interface GetAssessmentResultRequestProps {
  assessmentId: string;
}

export interface CriterionSummary {
  averageCriterionScore: number;
  criterionComments: string[];
}

export interface CompetenceSummary {
  averageCompetenceScore: number;
  criterionSummaries: Map<string, CriterionSummary>
  competenceComments: string[];
}

export interface CompletedAssessmentData {
  competenceSummaries: Map<string, CompetenceSummary>
}

export interface GetCompetenceResultsRequestProps {
  userId: string;
  competenceId: string;
}

export interface CompetenceResult {
  assessmentId: string;
  assessmentDate: Date;
  competenceScore: number;
}
