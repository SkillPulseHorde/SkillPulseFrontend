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

export interface StartAssessmentRequestProps {
  evaluateeId: string;
  startAt: Date;
  endsAt: Date;
  createdByUserId: string;
  evaluatorIds: string[];
}

export interface Assessment {
  id: string;
  evaluateeId: string;
  evaluateeFullName: string;
  evaluateePosition: string;
  evaluateeTeamName: string;
  startAt: Date;
  endsAt: Date;
}
