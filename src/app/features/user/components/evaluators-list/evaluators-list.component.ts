import {Component, computed, effect, inject, input, signal, untracked} from '@angular/core';
import {Fieldset} from '../../../../components/fieldset/fieldset.component';
import {SearchComponent} from '../../../../components/search/search.component';
import {Evaluator} from '../../store/user.model';
import {UserService} from '../../api/user.service';
import {Store} from '@ngrx/store';
import {UserState} from '../../store/user.reducers';
import {forkJoin, take} from 'rxjs';
import {Button} from '../../../../components/button/button.component';
import {AssessmentService} from '../../../assessment/api/assessment.service';
import {NgClass} from '@angular/common';
import {EvaluatorsListItem} from '../evaluators-list-item/evaluators-list-item.component';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'evaluators-list',
  imports: [
    Fieldset,
    SearchComponent,
    Button,
    NgClass,
    EvaluatorsListItem,
  ],
  templateUrl: './evaluators-list.component.html',
  styleUrl: './evaluators-list.component.css'
})
export class EvaluatorsList {
  userService = inject(UserService)
  assessmentService = inject(AssessmentService)
  toastService = inject(ToastrService)
  store = inject(Store<{ user: UserState }>)

  userId = input.required<string>();
  assessmentEvaluatorsId = input<string[]>([]);
  disabled = input<boolean>(false);

  title = input<string>('Выберите рецензентов')
  isEditable = input<boolean>(true);

  users = signal<Evaluator[]>([])
  filteredUsers = signal<Evaluator[]>([])
  evaluators = signal<string[]>([])
  initialEvaluators = signal<string[]>([])

  areEvaluatorsListsEqual = computed(() => [...this.evaluators()].sort().join('#') === [...this.initialEvaluators()].sort().join('#'))

  searchEvaluators(query: string | null) {
    if (!query) {
      this.filteredUsers.set(this.users())
      return
    }

    this.filteredUsers.set(this.users().filter(evaluator => {
        const q = query.toLowerCase()
        return evaluator.lastName?.toLowerCase().startsWith(q) ||
          evaluator.firstName?.toLowerCase().startsWith(q) ||
          evaluator.midName?.toLowerCase().startsWith(q) ||
          this.evaluators().includes(evaluator.id)
      }
    ))
  }

  toggleEvaluator(userId: string) {
    if (this.disabled()) return

    if (this.evaluators().includes(userId)) {
      this.evaluators.set(this.evaluators().filter(id => id !== userId));
    } else {
      this.evaluators.set([...this.evaluators(), userId]);
    }
  }

  updateEvaluatorsList() {
    this.assessmentService.updateEvaluatorsIds({userId: this.userId(), evaluatorIds: this.evaluators()}).pipe(
      take(1),
    ).subscribe({
      next: () => {
        this.initialEvaluators.set(this.evaluators())
        this.toastService.success("Список рецензентов успешно обновлён!");
      },
      error: (err) => {
        const errorMsg = err.error.detail || "Ошибка обновления списка рецензентов";
        this.toastService.error(errorMsg);
      }
    })
  }

  fetchEvaluators() {
    forkJoin([this.userService.getUsers({
      userId: this.userId(),
      includeCurrentUser: false
    }), this.assessmentService.getEvaluatorsIds({userId: this.userId()})]).subscribe(
      ([users, ids]) => {
        this.users.set(users)
        this.filteredUsers.set(users)
        this.evaluators.set(ids)
        this.initialEvaluators.set(ids)
      },
      err => {
        const errorMsg = err.error.detail || "Ошибка получения пользователей и рецензентов"
        this.toastService.error(errorMsg);
      }
    )
  }

  fetchUsers() {
    this.userService.getUsers({
      userId: this.userId(),
      includeCurrentUser: false
    }).pipe(
      take(1)
    ).subscribe({
      next: (users) => {
        this.users.set(users)
        this.filteredUsers.set(users)
        this.evaluators.set(this.assessmentEvaluatorsId())
        this.initialEvaluators.set(this.assessmentEvaluatorsId())
      },
      error: err => {
        const errorMsg = err.error.detail || "Ошибка получения пользователей"
        this.toastService.error(errorMsg);
      }
    })
  }

  constructor() {
    effect(() => {
      if (!this.userId()) return

      if (this.assessmentEvaluatorsId().length !== 0) {
        this.fetchUsers()
        return;
      }

      untracked(() => this.fetchEvaluators())
    });
  }
}
