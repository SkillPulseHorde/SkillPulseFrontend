import {Component, computed, inject, OnInit, signal, viewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Button} from '../../../../components/button/button.component';
import {Datepicker} from '../../../../components/datepicker/datepicker.component';
import {EvaluatorsList} from '../../../user/components/evaluators-list/evaluators-list.component';
import {Fieldset} from '../../../../components/fieldset/fieldset.component';
import {SelectComponent} from '../../../../components/select/select.component';
import {FormControl} from '@angular/forms';
import {Assessment} from '../../store/assessment.model';
import {SelectOption} from '../../../../components/select/select.model';
import {getFullName, getPositionString} from '../../../utils';
import {Evaluator} from '../../../user/store/user.model';
import {take} from 'rxjs';
import {AssessmentService} from '../../api/assessment.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../../user/api/user.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'edit-assessment-page',
  imports: [
    Button,
    Datepicker,
    EvaluatorsList,
    Fieldset,
    SelectComponent,
    NgClass
  ],
  templateUrl: './edit-assessment-page.html',
  styleUrl: './edit-assessment-page.css',
})
export class EditAssessmentPage implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  assessmentService = inject(AssessmentService);
  userService = inject(UserService);
  toastService = inject(ToastrService);
  router = inject(Router);

  assessmentId = signal('')
  assessment = signal<Assessment | null>(null);
  isActive = computed(() => this.assessment() ? this.assessment()!.startAt.getTime() <= new Date().getTime() : true);

  startDate = new FormControl<string | null>({value: null, disabled: true});
  endDate = new FormControl<string | null>(null);

  today = signal(new Date());
  minEndDate = signal<Date | null>(new Date(new Date().setDate(new Date().getDate() + 1)));

  users = signal<Evaluator[]>([]);

  selected = signal<string>("")
  selectedOption = computed<SelectOption | undefined>(() => {
    let user = this.users().find(u => u.id === this.selected())
    if (!user) return undefined;
    return ({
      value: user?.id,
      label: getFullName(user)
    })
  })
  selectOptions = computed<SelectOption[]>(() => this.users().map(u => ({
    value: u.id,
    label: `${getFullName(u)} | ${getPositionString(u.position)}${u.teamName ? " | " + u.teamName : ""}`
  })));

  evaluatorsList = viewChild(EvaluatorsList);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (!id) {
        this.router.navigate(['/manage-assessments']);
        return
      }

      this.assessmentId.set(params['id']);
    });
  }

  fetchUsers(userId: string) {
    this.userService.getUsers({userId, includeCurrentUser: true}).pipe(
      take(1),
    ).subscribe(
      users => {
        if (!this.assessment()) return

        this.users.set(users)
        this.selected.set(this.assessment()!.evaluateeInfo.id)
      },
      err => {
        const errorMsg = err.error.detail || "Ошибка получения пользователей"
        this.toastService.error(errorMsg);
      }
    )
  }

  fetchAssessment() {
    this.assessmentService.getAssessment({assessmentId: this.assessmentId()}).subscribe({
      next: assessment => {
        this.assessment.set(assessment);

        const nextDay = new Date()
        nextDay.setDate(nextDay.getDate() + 1)

        this.minEndDate.set(new Date(nextDay))
        this.startDate.setValue(assessment.startAt.toISOString().split('T')[0])
        this.endDate.setValue(assessment.endsAt.toISOString().split('T')[0])

        this.fetchUsers(assessment.evaluateeInfo.id)
      },
      error: err => {
        const errorMsg = err.error?.detail || "Ошибка получения аттестации";
        this.toastService.error(errorMsg)
        this.router.navigate(['/manage-assessments']);
      }
    })
  }

  ngOnInit() {
    this.fetchAssessment()
  }

  isFormValid() {
    const startDate = new Date(this.startDate.value!);
    const endDate = this.endDate.value ? new Date(this.endDate.value) : null;
    if (!endDate) {
      this.toastService.error("Дата окончания не выбрана")
      return false;
    }
    if (startDate.getTime() >= endDate.getTime()) {
      this.toastService.error("Дата окончания не может быть меньше или равна дате начала")
      return false;
    }
    if (!this.evaluatorsList()?.evaluators().length) {
      this.toastService.error("Список рецензентов пуст")
      return false;
    }
    return true;
  }

  editAssessment() {
    if (!this.isFormValid()) return

    this.assessmentService.updateAssessment({
      assessmentId: this.assessment()!.assessmentId,
      endsAt: new Date(this.endDate.value!),
      evaluatorIds: this.evaluatorsList()!.evaluators()
    }).pipe(
      take(1),
    ).subscribe(
      () => {
        this.toastService.success("Аттестация успешно отредактирована")
        this.router.navigate(["/manage-assessments"])
      },
      err => {
        const errorMsg = err.error.detail || "Ошибка редактирования аттестации"
        this.toastService.error(errorMsg)
      }
    )
  }
}
