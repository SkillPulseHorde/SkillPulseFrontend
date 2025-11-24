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
