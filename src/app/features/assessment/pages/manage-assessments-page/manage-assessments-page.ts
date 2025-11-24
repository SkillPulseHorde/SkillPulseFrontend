import {Component, effect, inject, signal, TemplateRef, viewChild} from '@angular/core';
import {Button} from '../../../../components/button/button.component';
import {Tab} from '../../../../components/tab/tab.component';
import {Fieldset} from '../../../../components/fieldset/fieldset.component';
import {AssessmentService} from '../../api/assessment.service';
import {take} from 'rxjs';
import {Assessment} from '../../store/assessment.model';
import {Router} from '@angular/router';
import {AssessmentComponent} from '../../components/assessment/assessment.component';
import {ModalService} from '../../../../components/modal/modal.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'manage-assessments-page',
  imports: [
    Button,
    Tab,
    Fieldset,
    AssessmentComponent
  ],
  templateUrl: './manage-assessments-page.html',
  styleUrl: './manage-assessments-page.css',
})
export class ManageAssessmentsPage {
  assessmentService = inject(AssessmentService);
  router = inject(Router);
  modalService = inject(ModalService);
  toastService = inject(ToastrService)
  isActive = signal(true)
  assessments = signal<Assessment[]>([])

  deleteModal = viewChild<TemplateRef<any>>('deleteModal');

  assessmentToDeleteId = signal<string>("")

  toggleIsActive() {
    this.isActive.set(!this.isActive())
  }

  constructor() {
    effect(() => {
      this.assessmentService.getAssessments({isActive: this.isActive()}).pipe(
        take(1)
      ).subscribe({
        next: assessments => {
          this.assessments.set(assessments);
        },
        error: err => {
          const errorMsg = err.error.detail || "Ошибка получения списка аттестаций"
          this.toastService.error(errorMsg)
        }
      })
    });
  }

  onNewAssessmentButtonClick() {
    this.router.navigate(['manage-assessments/new']);
  }

  onEditAssessmentButtonClick(id: string) {
    console.log("EDIT:", id)
  }

  onDeleteAssessmentButtonClick(id: string) {
    this.modalService.open("Удалить аттестацию", this.deleteModal()!)
    this.assessmentToDeleteId.set(id)
  }

  deleteAssessment() {
    this.assessmentService.deleteAssessment(this.assessmentToDeleteId()).pipe(
      take(1),
    ).subscribe({
      next: () => {
        this.assessments.set(this.assessments().filter(assessment => assessment.assessmentId !== this.assessmentToDeleteId()))
        this.assessmentToDeleteId.set("")
        this.toastService.success("Аттестация успешно удалена")
        this.modalService.close()
      },
      error: err => {
        const errorMsg = err.error.detail || "Ошибка удаления аттестации"
        this.toastService.error(errorMsg)
      }
    })
  }
}
