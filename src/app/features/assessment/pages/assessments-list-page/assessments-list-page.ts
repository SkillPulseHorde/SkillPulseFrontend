import {Component, inject, signal} from '@angular/core';
import {Fieldset} from '../../../../components/fieldset/fieldset.component';
import {AssessmentService} from '../../api/assessment.service';
import {ToastrService} from 'ngx-toastr';
import {Store} from '@ngrx/store';
import {UserState} from '../../../user/store/user.reducers';
import {take} from 'rxjs';
import {Assessment} from '../../store/assessment.model';
import {AssessmentComponent} from '../../components/assessment/assessment.component';
import {Router} from '@angular/router';

@Component({
  selector: 'assessments-list-page',
  imports: [
    Fieldset,
    AssessmentComponent
  ],
  templateUrl: './assessments-list-page.html',
  styleUrl: './assessments-list-page.css',
})
export class AssessmentsListPage {
  assessmentService = inject(AssessmentService);
  toastService = inject(ToastrService);
  router = inject(Router);

  assessments = signal<Assessment[]>([]);

  constructor(private store: Store<{ user: UserState }>) {
    this.store.select((state) => state.user.user?.userId).pipe(
      take(1),
    ).subscribe(userId => {
      if (!userId) return;

      this.assessmentService.getActiveAssessmentsByEvaluator({userId}).subscribe({
        next: assessments => {
          this.assessments.set(assessments)
        },
        error: err => {
          const errorMsg = err.error?.detail || "Ошибка получения назначенных аттестаций"
          this.toastService.error(errorMsg)
        }
      })
    });
  }

  onAssessmentClicked(assessmentId: string) {
    this.router.navigate(['/assessments', assessmentId]);
  }
}
