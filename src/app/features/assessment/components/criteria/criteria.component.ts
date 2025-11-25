import {Component, input} from '@angular/core';
import {Checkbox} from '../../../../components/checkbox/checkbox.component';
import {Rating} from '../../../../components/rating/rating.component';
import {Textarea} from '../../../../components/textarea/textarea.component';
import {Criteria} from '../../store/assessment.model';

@Component({
  selector: 'criteria',
  imports: [
    Checkbox,
    Rating,
    Textarea
  ],
  templateUrl: './criteria.component.html',
  styleUrl: './criteria.component.css',
})
export class CriteriaComponent {
  criteria = input.required<Criteria>()
}
