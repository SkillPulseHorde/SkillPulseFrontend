import {Component, inject, OnInit, signal} from '@angular/core';
import {AssessmentService} from '../../api/assessment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {Assessment, Competence} from '../../store/assessment.model';
import {IconButton} from '../../../../components/icon-button/icon-button.component';
import {CompetenceComponent} from '../../components/competence/competence.component';
import {CriteriaComponent} from '../../components/criteria/criteria.component';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'assessment-form-page',
  imports: [
    IconButton,
    CompetenceComponent,
    CriteriaComponent
  ],
  templateUrl: './assessment-form-page.html',
  styleUrl: './assessment-form-page.css',
})
export class AssessmentFormPage implements OnInit {
  assessmentService = inject(AssessmentService)
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  toastService = inject(ToastrService);

  assessment = signal<Assessment | null>(null);
  competences = signal<Competence[]>([])

  assessmentForm = new FormGroup({
    competences: new FormArray([])
  });

  getCompetences() {
    return this.assessmentForm.get('competences') as FormArray;
  }

  createForm(competences: Competence[]) {
    const formCompetences = this.getCompetences()

    for (const competence of competences) {
      const competenceFG = new FormGroup({
        comment: new FormControl(''),
        criteria: new FormArray(
          competence.criteria.map(() => (
            new FormGroup({
              cannotEvaluate: new FormControl(false),
              comment: new FormControl(''),
              rating: new FormControl(0),
            })
          ))
        )
      })

      formCompetences.push(competenceFG)
    }

    console.log(formCompetences);
  }

  ngOnInit() {
    const assessmentId = this.activatedRoute.snapshot.params["assessmentId"];

    if (assessmentId === "") return

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
}
