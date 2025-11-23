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

export interface GetAssessmentRequestProps {
  assessmentId: string;
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

export interface Assessment {
  id: string;
  evaluateeId: string;
  evaluateeFullName: string;
  evaluateePosition: Position;
  evaluateeTeamName: string;
  startAt: Date;
  endsAt: Date;
  evaluatorIds: string[];
}
