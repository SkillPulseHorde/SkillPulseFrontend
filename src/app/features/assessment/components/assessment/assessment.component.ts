import {Component, computed, input, output} from '@angular/core';
import {Assessment} from '../../store/assessment.model';
import {Avatar} from '../../../../components/avatar/avatar.component';
import {formatDate, getPositionString} from '../../../utils';
import {Icon} from '../../../../components/icon/icon.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'assessment',
  imports: [
    Avatar,
    Icon,
    NgClass
  ],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css',
})
export class AssessmentComponent {
  assessment = input.required<Assessment>();
  isEditable = input<boolean>(false);
  isDeletable = input<boolean>(false);
  isClickable = input<boolean>(false);

  clicked = output<string>();

  editButtonClicked = output<string>();
  deleteButtonClicked = output<string>();

  onEditButtonClick() {
    this.editButtonClicked.emit(this.assessment().id)
  }

  onDeleteButtonClicked() {
    this.deleteButtonClicked.emit(this.assessment().id)
  }

  onAssessmentClick() {
    if (!this.isClickable) return

    this.clicked.emit(this.assessment().id)
  }

  deadlines = computed<string>(() => `${formatDate(this.assessment().startAt)} - ${formatDate(this.assessment().endsAt)}`);
  protected readonly getPositionString = getPositionString;
}
