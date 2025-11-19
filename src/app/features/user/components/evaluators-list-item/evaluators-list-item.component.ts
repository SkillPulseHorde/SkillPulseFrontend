import {Component, input, output} from '@angular/core';
import {Avatar} from '../../../../components/avatar/avatar.component';
import {Evaluator} from '../../store/user.model';
import {getFullName, getPositionString} from '../../../utils';
import {Checkbox} from '../../../../components/checkbox/checkbox.component';

@Component({
  selector: 'evaluators-list-item',
  imports: [
    Avatar,
    Checkbox
  ],
  templateUrl: './evaluators-list-item.component.html',
  styleUrl: './evaluators-list-item.component.css'
})
export class EvaluatorsListItem {
  user = input.required<Evaluator>();
  checked = input(false);
  checkboxClicked = output<string>();

  checkboxClick() {
    this.checkboxClicked.emit(this.user().id)
  }

  protected readonly getFullName = getFullName;
  protected readonly getPositionString = getPositionString;
}
