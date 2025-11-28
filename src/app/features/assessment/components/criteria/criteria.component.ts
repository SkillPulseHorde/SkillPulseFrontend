import {Component, input} from '@angular/core';
import {Checkbox} from '../../../../components/checkbox/checkbox.component';
import {Rating} from '../../../../components/rating/rating.component';
import {Textarea} from '../../../../components/textarea/textarea.component';
import {Criteria} from '../../store/assessment.model';
import {CriteriaFormGroup} from '../../pages/assessment-form-page/assessment-form.model';
import {FormGroup} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'criteria',
  imports: [
    Checkbox,
    Rating,
    Textarea,
    NgClass
  ],
  templateUrl: './criteria.component.html',
  styleUrl: './criteria.component.css',
})
export class CriteriaComponent {
  criteria = input.required<Criteria>()
  control = input.required<FormGroup<CriteriaFormGroup>>()

  checkedChange() {
    const cannotEvaluateFormControl = this.control().controls.cannotEvaluate
    cannotEvaluateFormControl.setValue(!cannotEvaluateFormControl.value)
  }
}
