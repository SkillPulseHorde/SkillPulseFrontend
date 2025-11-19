import {Component, input, output} from '@angular/core';
import {Avatar} from '../../../../components/avatar/avatar.component';
import {Reviewer} from '../../store/user.model';
import {getFullName, getPositionString} from '../../../utils';
import {Checkbox} from '../../../../components/checkbox/checkbox.component';

@Component({
  selector: 'reviewers-list-item',
  imports: [
    Avatar,
    Checkbox
  ],
  templateUrl: './reviewers-list-item.component.html',
  styleUrl: './reviewers-list-item.component.css'
})
export class ReviewersListItem {
  user = input.required<Reviewer>();
  checked = input(false);
  checkboxClicked = output<string>();

  checkboxClick() {
    this.checkboxClicked.emit(this.user().id)
  }

  protected readonly getFullName = getFullName;
  protected readonly getPositionString = getPositionString;
}
