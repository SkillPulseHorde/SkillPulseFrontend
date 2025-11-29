import {FormArray, FormControl, FormGroup} from '@angular/forms';

export interface AssessmentFormGroup {
  competences: FormArray<FormGroup<CompetenceFormGroup>>
}

export interface CompetenceFormGroup {
  comment: FormControl<string | null>,
  criteria: FormArray<FormGroup<CriteriaFormGroup>>
}

export interface CriteriaFormGroup {
  cannotEvaluate: FormControl<boolean | null>,
  comment: FormControl<string | null>,
  rating: FormControl<number | null>,
}
