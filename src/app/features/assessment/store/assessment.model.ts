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
  criterionEvaluations: CriterionEvaluation[] | null
  competenceComment: string | null
}

export interface CriterionEvaluation {
  criterionId: string;
  score: number | null;
  criterionComment: string;
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
  evaluateeInfo: Evaluatee
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
  criteria: Criteria[]
}
