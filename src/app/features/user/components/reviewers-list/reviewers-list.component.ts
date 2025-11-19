import {Component, inject, signal} from '@angular/core';
import {Fieldset} from '../../../../components/fieldset/fieldset.component';
import {SearchComponent} from '../../../../components/search/search.component';
import {Reviewer, User} from '../../store/user.model';
import {UserService} from '../../api/user.service';
import {Store} from '@ngrx/store';
import {UserState} from '../../store/user.reducers';
import {take} from 'rxjs';
import {ReviewersListItem} from '../reviewers-list-item/reviewers-list-item.component';
import {Button} from '../../../../components/button/button.component';
import {AssessmentService} from '../../../assessment/api/assessment.service';

@Component({
  selector: 'reviewers-list',
  imports: [
    Fieldset,
    SearchComponent,
    ReviewersListItem,
    Button
  ],
  templateUrl: './reviewers-list.component.html',
  styleUrl: './reviewers-list.component.css'
})
export class ReviewersList {
  userService = inject(UserService)
  assessmentService = inject(AssessmentService)
  store = inject(Store<{ user: UserState }>)

  userId = signal("")
  users = signal<Reviewer[]>([])
  filteredUsers = signal<Reviewer[]>([])
  reviewers = signal<string[]>([])
  initialReviewers = signal<string[]>([])

  searchEvaluators(query: string | null) {
    if (!query) {
      this.filteredUsers.set(this.users())
      return
    }

    this.filteredUsers.set(this.users().filter(reviewer => {
        const q = query.toLowerCase()
        return reviewer.lastName?.toLowerCase().startsWith(q) ||
          reviewer.firstName?.toLowerCase().startsWith(q) ||
          reviewer.midName?.toLowerCase().startsWith(q)
      }
    ))
  }

  toggleEvaluator(userId: string) {
    if (this.reviewers().includes(userId)) {
      this.reviewers.set(this.reviewers().filter(id => id !== userId));
    } else {
      this.reviewers.set([...this.reviewers(), userId]);
    }
  }

  updateEvaluatorsList() {
    this.assessmentService.updateEvaluatorsIds({userId: this.userId(), evaluatorIds: this.reviewers()}).subscribe({
      next: () => {
        this.initialReviewers.set(this.reviewers())
      },
      error: (err) => {
        const errorMsg = err.error.message || "Ошибка обновления списка рецензентов";
        console.error(errorMsg);
      }
    })
  }

  ngOnInit() {
    this.store.select(state => state.user.user?.userId).subscribe(
      userId => {
        this.userId.set(userId);
        this.userService.getUsers({userId}).pipe(
          take(1),
        ).subscribe(
          users => {
            this.users.set(users)
            this.filteredUsers.set(users)
          }
        )
        this.assessmentService.getEvaluatorsIds({userId}).pipe(
          take(1),
        ).subscribe(
          ids => {
            this.reviewers.set(ids)
            this.initialReviewers.set(ids)
          }
        )
      }
    )
  }
}
