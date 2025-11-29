import {Component, inject, OnInit, signal, computed} from '@angular/core';
import {AssessmentService} from '../../api/assessment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {
  Assessment,
  Competence,
  CompetenceEvaluation,
  CriterionEvaluation,
} from '../../store/assessment.model';
import {IconButton} from '../../../../components/icon-button/icon-button.component';
import {CompetenceComponent} from '../../components/competence/competence.component';
import {CriteriaComponent} from '../../components/criteria/criteria.component';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  criteriaCommentRequiredValidator,
  criteriaRatingOrCannotEvaluateValidator,
  mandatoryCriteria
} from './assessment-form.validators';
import {AssessmentFormGroup, CompetenceFormGroup, CriteriaFormGroup} from './assessment-form.model';
import {Button} from '../../../../components/button/button.component';
import {Icon} from '../../../../components/icon/icon.component';
import {ViewportScroller} from '@angular/common';
import {UserState} from '../../../user/store/user.reducers';
import {Store} from '@ngrx/store';

@Component({
  selector: 'assessment-form-page',
  imports: [
    IconButton,
    CompetenceComponent,
    CriteriaComponent,
    Button,
    Icon
  ],
  templateUrl: './assessment-form-page.html',
  styleUrl: './assessment-form-page.css',
})
export class AssessmentFormPage implements OnInit {
  assessmentService = inject(AssessmentService)
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  toastService = inject(ToastrService);
  viewportScroller = inject(ViewportScroller);

  assessment = signal<Assessment | null>(null);
  competences = signal<Competence[]>([])
  userId = signal("")
  unevaluatedMandatoryCriteria = signal<Map<string, string[]>>(new Map<string, string[]>())
  unevaluatedMandatoryCompetences = computed(() => [...this.unevaluatedMandatoryCriteria().keys()])
  isSecondAttemptToEvaluate = signal<boolean>(false)

  assessmentForm = new FormGroup<AssessmentFormGroup>({
    competences: new FormArray<FormGroup<CompetenceFormGroup>>([])
  });

  getCompetences() {
    return this.assessmentForm.controls.competences;
  }

  createForm(competences: Competence[]) {
    const formCompetences = this.getCompetences()

    for (const competence of competences) {
      const competenceFG = new FormGroup<CompetenceFormGroup>({
        comment: new FormControl(''),
        criteria: new FormArray<FormGroup<CriteriaFormGroup>>(
          competence.criteria.map(criteria => {
            const criteriaGroup = new FormGroup<CriteriaFormGroup>({
              cannotEvaluate: new FormControl(false),
              comment: new FormControl(''),
              rating: new FormControl(0),
            })

            criteriaGroup.setValidators([
              criteriaCommentRequiredValidator(),
              criteriaRatingOrCannotEvaluateValidator(),
              mandatoryCriteria(criteria.isMandatory)
            ])

            return criteriaGroup
          })
        )
      })

      competenceFG.controls.comment.setValidators([Validators.required])

      formCompetences.push(competenceFG)
    }
  }

  constructor(store: Store<{ user: UserState }>) {
    store.select(state => state.user.user?.userId).pipe(
      take(1)
    ).subscribe(userId => {
      this.userId.set(userId!)
    })
  }

  ngOnInit() {
    const assessmentId = this.activatedRoute.snapshot.params["assessmentId"];

    if (assessmentId === "") return;

    this.assessmentService.getAssessment({assessmentId}).subscribe({
      next: assessment => {
        this.assessment.set(assessment)

        this.assessmentService.getCompetences({evaluateeId: assessment.evaluateeInfo.id}).pipe(
          take(1)
        ).subscribe({
          next: competences => {
            this.competences.set(competences);

            this.createForm(competences);
          },
          error: err => {
            const errorMsg = err.error?.detail || "Ошибка получения списка компетенций"
            this.toastService.error(errorMsg)
            this.router.navigate(['/assessments'])
          }
        })
      },
      error: err => {
        const errorMsg = err.error?.detail || "Ошибка получения данных об аттестации"
        this.toastService.error(errorMsg)
        this.router.navigate(['/assessments'])
      }
    })
  }

  onBackButtonClick() {
    this.router.navigate(['/assessments'])
  }

  private buildCompetenceEvaluations(): CompetenceEvaluation[] {
    const competenceEvaluations: CompetenceEvaluation[] = []

    const formCompetences = this.assessmentForm.controls.competences

    for (let i = 0; i < this.competences().length; i++) {
      const comp = formCompetences.at(i)
      const competence: CompetenceEvaluation = {
        competenceId: this.competences()[i].id,
        criterionEvaluations: [],
        competenceComment: comp.controls.comment.value
      }
      let shouldExcludeCompetence = false
      for (let j = 0; j < comp.controls.criteria.length; j++) {
        const crit = comp.controls.criteria.at(j)

        const score = crit.controls.rating.value
        const comment = crit.controls.comment.value === "" ? null : crit.controls.comment.value
        const cannotEvaluate = crit.controls.cannotEvaluate.value

        if (this.competences()[i].criteria[j].isMandatory && cannotEvaluate) {
          shouldExcludeCompetence = true
          break
        }

        const criterion: CriterionEvaluation = {
          criterionId: this.competences()[i].criteria[j].id,
          score: cannotEvaluate ? null : score,
          criterionComment: comment
        }

        competence.criterionEvaluations?.push(criterion)
      }
      if (shouldExcludeCompetence) {
        competence.criterionEvaluations = null
        competence.competenceComment = null
      }
      competenceEvaluations.push(competence)
    }

    return competenceEvaluations
  }

  private evaluate() {
    const competenceEvaluations = this.buildCompetenceEvaluations()

    this.assessmentService.evaluate({
      assessmentId: this.assessment()?.assessmentId!,
      evaluatorId: this.userId(),
      competenceEvaluations: competenceEvaluations
    }).pipe(
      take(1)
    ).subscribe({
      next: () => {
        this.router.navigate(['/assessments'])
        this.toastService.success("Оценки успешно отправлены")
      },
      error: err => {
        const errorMsg = err.error?.detail || "Ошибка отправки оценки"
        this.toastService.error(errorMsg)
      }
    })
  }

  onEvaluateButtonClick() {
    const unevaluatedCriteria: string[] = []
    const unevaluatedMandatory: Map<string, string[]> = new Map<string, string[]>()
    const emptyComment: string[] = []

    for (let i = 0; i < this.competences().length; i++) {
      const comp = this.assessmentForm.controls.competences.at(i)
      comp.markAllAsTouched()
      if (comp.controls.comment.hasError('required')) {
        emptyComment.push(this.competences()[i].name)
      }

      for (let j = 0; j < comp.controls.criteria.length; j++) {
        const crit = comp.controls.criteria.at(j)
        if (crit.hasError('ratingOrCannotEvaluateRequired')) {
          unevaluatedCriteria.push(this.competences()[i].criteria[j].name)
        }
        if (crit.hasError('mandatoryCriteria')) {
          const competenceName = this.competences()[i].name;
          const criteriaName = this.competences()[i].criteria[j].name;
          const existing = unevaluatedMandatory.get(competenceName) ?? [];
          unevaluatedMandatory.set(competenceName, [...existing, criteriaName]);
        }
        if (crit.controls.comment.hasError('commentRequired')) {
          emptyComment.push(this.competences()[i].criteria[j].name)
        }
      }
    }

    if (unevaluatedCriteria.length > 0) {
      this.isSecondAttemptToEvaluate.set(false)
      this.unevaluatedMandatoryCriteria.set(new Map<string, string[]>())
      this.toastService.error("Все критерии должны быть оценены или отмечены флагом \"Не могу оценить\"")
      this.viewportScroller.scrollToPosition([0, 0], {behavior: 'smooth'})
      return
    }

    if (emptyComment.length > 0) {
      this.isSecondAttemptToEvaluate.set(false)
      this.unevaluatedMandatoryCriteria.set(new Map<string, string[]>())
      this.toastService.error("Не заполнены обязательные поля комментариев")
      this.viewportScroller.scrollToPosition([0, 0], {behavior: 'smooth'})
      return
    }

    if ([...unevaluatedMandatory.entries()].length > 0 && !this.isSecondAttemptToEvaluate()) {
      this.isSecondAttemptToEvaluate.set(true)
      this.unevaluatedMandatoryCriteria.set(unevaluatedMandatory)
      this.viewportScroller.scrollToPosition([0, 0], {behavior: 'smooth'})
      return
    }

    this.evaluate()
  }
}
