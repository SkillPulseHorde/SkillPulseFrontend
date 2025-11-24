import {Component, computed, inject, OnInit, signal, viewChild} from '@angular/core';
import {Fieldset} from '../../../../components/fieldset/fieldset.component';
import {FormControl} from '@angular/forms';
import {EvaluatorsList} from '../../../user/components/evaluators-list/evaluators-list.component';
import {Button} from '../../../../components/button/button.component';
import {take} from 'rxjs';
import {Store} from '@ngrx/store';
import {UserState} from '../../../user/store/user.reducers';
import {UserService} from '../../../user/api/user.service';
import {ToastrService} from 'ngx-toastr';
import {Evaluator} from '../../../user/store/user.model';
import {getFullName, getPositionString} from '../../../utils';
import {SelectComponent} from '../../../../components/select/select.component';
import {SelectOption} from '../../../../components/select/select.model';
import {AssessmentService} from '../../api/assessment.service';
import {Router} from '@angular/router';
import {Datepicker} from '../../../../components/datepicker/datepicker.component';

@Component({
  selector: 'new-assessment-page',
  imports: [
    Fieldset,
    EvaluatorsList,
    Button,
    SelectComponent,
    Datepicker
  ],
  templateUrl: './new-assessment-page.html',
  styleUrl: './new-assessment-page.css',
})
export class NewAssessmentPage implements OnInit {
  store = inject(Store<{ user: UserState }>)
  userService = inject(UserService)
  assessmentService = inject(AssessmentService);
  toastService = inject(ToastrService)
  router = inject(Router)

  startDate = new FormControl<string | null>(null);
  endDate = new FormControl<string | null>(null);

  today = signal(new Date());
  minEndDate = signal<Date | null>(new Date(new Date().setDate(new Date().getDate() + 1)));

  userId = signal("")

  users = signal<Evaluator[]>([]);
  filteredUsers = signal<Evaluator[]>([]);

  searchEvaluators(query: string | null) {
    if (!query) {
      this.filteredUsers.set(this.users())
      return
    }

    this.filteredUsers.set(this.users().filter(user => {
        const q = query.toLowerCase()
        return user.lastName?.toLowerCase().startsWith(q) ||
          user.firstName?.toLowerCase().startsWith(q) ||
          user.midName?.toLowerCase().startsWith(q) ||
          user.teamName?.toLowerCase().startsWith(q) ||
          getPositionString(user.position).toLowerCase().startsWith(q)
      }
    ))
  }

  selected = signal<string>("")
  selectedOption = computed<SelectOption | undefined>(() => {
    let user = this.users().find(u => u.id === this.selected())
    if (!user) return undefined;
    return ({
      value: user?.id,
      label: getFullName(user)
    })
  })
  selectOptions = computed<SelectOption[]>(() => this.filteredUsers().map(u => ({
    value: u.id,
    label: `${getFullName(u)} | ${getPositionString(u.position)}${u.teamName ? " | " + u.teamName : ""}`
  })));

  selectOption(value: string) {
    this.selected.set(value)
  }

  evaluatorsList = viewChild(EvaluatorsList);

  ngOnInit() {
    this.store.select(state => state.user.user?.userId).pipe(
      take(1)
    ).subscribe(
      userId => {
        if (!userId) return

        this.userId.set(userId);

        this.userService.getUsers({userId, includeCurrentUser: true}).pipe(
          take(1),
        ).subscribe(
          users => {
            this.users.set(users)
            this.filteredUsers.set(users)
          },
          err => {
            const errorMsg = err.error?.detail || "Ошибка получения пользователей"
            this.toastService.error(errorMsg);
          }
        )
      }
    )
    this.startDate.valueChanges.subscribe(date => {
      if (!date) return

      const d = new Date(date)
      const nextDay = new Date(d)
      nextDay.setDate(nextDay.getDate() + 1)

      this.minEndDate.set(new Date(nextDay))
    })
  }

  isFormValid() {
    const startDate = this.startDate.value ? new Date(this.startDate.value) : null;
    const endDate = this.endDate.value ? new Date(this.endDate.value) : null;
    if (!startDate) {
      this.toastService.error("Дата начала не выбрана")
      return false;
    }
    if (!endDate) {
      this.toastService.error("Дата окончания не выбрана")
      return false;
    }
    if (startDate.getTime() >= endDate.getTime()) {
      this.toastService.error("Дата окончания не может быть меньше или равна дате начала")
      return false;
    }
    if (!this.users().find(u => u.id === this.selected())) {
      this.toastService.error("Сотрудник для оценки не выбран")
      return false;
    }
    if (!this.evaluatorsList()?.evaluators().length) {
      this.toastService.error("Список рецензентов пуст")
      return false;
    }
    return true;
  }

  startAssessment() {
    if (!this.isFormValid()) return

    this.assessmentService.startAssessment({
      evaluateeId: this.selected(),
      startAt: new Date(this.startDate.value!),
      endsAt: new Date(this.endDate.value!),
      createdByUserId: this.userId(),
      evaluatorIds: this.evaluatorsList()!.evaluators()
    }).pipe(
      take(1),
    ).subscribe(
      () => {
        this.toastService.success("Аттестация успешно запущена")
        this.router.navigate(["/manage-assessments"])
      },
      err => {
        const errorMsg = err.error?.detail || "Ошибка запуска аттестации"

        this.toastService.error(errorMsg)
      }
    )
  }
}
