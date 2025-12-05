import {Component, computed, inject, OnInit, signal, TemplateRef, viewChild} from '@angular/core';
import {SelectComponent} from '../../../../components/select/select.component';
import {Button} from '../../../../components/button/button.component';
import {
  CompletedAssessmentData
} from '../../../assessment/store/assessment.model';
import {AssessmentService} from '../../../assessment/api/assessment.service';
import {Store} from '@ngrx/store';
import {UserState} from '../../store/user.reducers';
import {take} from 'rxjs';
import {SelectOption} from '../../../../components/select/select.model';
import {formatDate, getDateFromString, getTypedMapEntries} from '../../../utils';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {RadarChartComponent} from '../../../../components/radar-chart/radar-chart.component';
import {ChartDataset} from 'chart.js';
import {Accordion} from '../../../../components/accordion/accordion.component';
import {ModalService} from '../../../../components/modal/modal.service';
import {Icon} from '../../../../components/icon/icon.component';
import {NgClass} from '@angular/common';
import {LineChartComponent} from '../../../../components/line-chart/line-chart.component';

@Component({
  selector: 'results-page',
  imports: [
    SelectComponent,
    Button,
    RadarChartComponent,
    Accordion,
    Icon,
    NgClass,
    LineChartComponent,
  ],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.css',
})
export class ResultsPage implements OnInit {
  assessmentService = inject(AssessmentService);
  store = inject(Store<{ user: UserState }>)
  toastService = inject(ToastrService)
  router = inject(Router)
  modalService = inject(ModalService)

  userId = signal("")

  commentsModal = viewChild<TemplateRef<any>>('commentsModal');
  lineChartModal = viewChild<TemplateRef<any>>('lineChartModal');

  assessments = signal<SelectOption[]>([])
  assessmentsToCompare = computed(() => this.assessments().filter(a => a.value !== this.selectedMainAssessment()?.value && (!this.selectedMainAssessment() || getDateFromString(a.label.split(" - ")[1]).getTime() < getDateFromString(this.selectedMainAssessment()!.label.split(" - ")[0]).getTime())))
  competencesAndCriteria = signal<Map<string, string>>(new Map<string, string>())

  selectedMainAssessment = signal<SelectOption | null>(null)
  selectedCompareAssessment = signal<SelectOption | null>(null)

  mainAssessmentData = signal<CompletedAssessmentData | null>(null)
  compareAssessmentData = signal<CompletedAssessmentData | null>(null)
  assessmentScoreComparison = computed<Map<string, number>>(() => {
    const comparison = new Map<string, number>()
    if (!this.mainAssessmentData() || !this.compareAssessmentData()) return comparison

    getTypedMapEntries(this.mainAssessmentData()!.competenceSummaries).forEach(([compKey, compSummary]) => {
      comparison.set(compKey, compSummary.averageCompetenceScore)
      getTypedMapEntries(compSummary.criterionSummaries).forEach(([critKey, critSummary]) => {
        comparison.set(critKey, critSummary.averageCriterionScore)
      })
    })

    getTypedMapEntries(this.compareAssessmentData()!.competenceSummaries).forEach(([compKey, compSummary]) => {
      const compCurValue = comparison.get(compKey)
      comparison.set(compKey, compCurValue ? compCurValue - compSummary.averageCompetenceScore : compSummary.averageCompetenceScore)
      getTypedMapEntries(compSummary.criterionSummaries).forEach(([critKey, critSummary]) => {
        const critCurValue = comparison.get(critKey)
        comparison.set(critKey, critCurValue ? critCurValue - critSummary.averageCriterionScore : 0)
      })
    })

    return comparison
  })

  radarChartLabels = signal<string[]>([])
  radarChartDataset = signal<ChartDataset<"radar", (number | null)[]>[]>([])

  lineChartLabels = signal<string[]>([])
  lineChartDataset = signal<ChartDataset<"line", (number | null)[]>[]>([])

  comments = signal<string[]>([])

  ngOnInit() {
    this.store.select(state => state.user?.user?.userId).pipe(
      take(1),
    ).subscribe(userId => {
      this.userId.set(userId)
      this.assessmentService.getCompletedAssessments({userId}).pipe(
        take(1),
      ).subscribe(assessments => {
        this.assessments.set(assessments.map(a => ({
          value: a.assessmentId,
          label: `${formatDate(a.startAt)} - ${formatDate(a.endsAt)}`
        })))
      })
      this.fetchCompetences(userId);
    })
  }

  private fetchCompetences(userId: string) {
    this.assessmentService.getCompetences({evaluateeId: userId}).pipe(
      take(1),
    ).subscribe({
      next: results => {
        const competencesAndCriteria = new Map<string, string>()
        results.forEach(competence => {
          this.radarChartLabels.set([...this.radarChartLabels(), competence.name])
          competencesAndCriteria.set(competence.id, competence.name)
          competence.criteria.forEach(criteria => {
            competencesAndCriteria.set(criteria.id, criteria.name)
          })
        })
        this.competencesAndCriteria.set(competencesAndCriteria)
      },
      error: err => {
        const errorMsg = err.error?.detail ?? "Ошибка получения списка компетенций"
        this.toastService.error(errorMsg)
        this.router.navigate(['/profile'])
      }
    })
  }

  onMainAssessmentSelected(selectedAssessmentId: string) {
    this.selectedMainAssessment.set(this.assessments().find(a => a.value === selectedAssessmentId)!)

    this.assessmentService.getAssessmentResult({assessmentId: selectedAssessmentId}).pipe(
      take(1),
    ).subscribe({
      next: assessmentData => {
        this.mainAssessmentData.set(assessmentData)
        const dataset: ChartDataset<"radar", (number | null)[]> = {
          label: '',
          data: [],
          backgroundColor: 'rgba(194, 41, 24, 0.15)',
          borderColor: 'rgba(194, 41, 24, 1)',
        }
        dataset.label = this.selectedMainAssessment()?.label ?? ""
        for (const [_, summary] of Object.entries(assessmentData.competenceSummaries)) {
          if (!summary) {
            dataset.data.push(0)
            continue
          }
          dataset.data.push(summary.averageCompetenceScore)
        }
        this.radarChartDataset.set([dataset])
      },
      error: err => {
        const errorMsg = err.error?.detail ?? "Ошибка получения результатов аттестации"
        this.toastService.error(errorMsg)
      }
    })
  }

  onCompareAssessmentSelected(selectedAssessmentId: string) {
    this.selectedCompareAssessment.set(this.assessments().find(a => a.value === selectedAssessmentId)!)

    this.assessmentService.getAssessmentResult({assessmentId: selectedAssessmentId}).pipe(
      take(1),
    ).subscribe({
      next: assessmentData => {
        this.compareAssessmentData.set(assessmentData)
        const dataset: ChartDataset<"radar", (number | null)[]> = {
          label: '',
          data: [],
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderColor: 'rgba(59, 130, 246, 1)',
        }
        dataset.label = this.selectedCompareAssessment()?.label ?? ""
        for (const [_, summary] of getTypedMapEntries(assessmentData.competenceSummaries)) {
          if (!summary) {
            dataset.data.push(0)
            continue
          }
          dataset.data.push(summary.averageCompetenceScore)
        }
        this.radarChartDataset.set([...this.radarChartDataset(), dataset])
      },
      error: err => {
        const errorMsg = err.error?.detail ?? "Ошибка получения результатов аттестации"
        this.toastService.error(errorMsg)
      }
    })
  }

  openCommentModal(comments: string[]) {
    this.comments.set(comments)
    this.modalService.open("Комментарии", this.commentsModal()!)
  }

  openLineChartModal(clickedLabel: string) {
    this.assessmentService.getCompetenceResults({
      userId: this.userId(),
      competenceId: Array.from(this.competencesAndCriteria().entries()).find(([_, label]) => clickedLabel === label)![0]
    }).subscribe({
      next: competenceResults => {
        const labels: string[] = []
        const dataset: ChartDataset<"line", (number | null)[]> = {
          label: '',
          data: [],
          backgroundColor: 'rgba(194, 41, 24, 0.15)',
          borderColor: 'rgba(194, 41, 24, 1)',
        }
        for (const result of competenceResults) {
          labels.push(formatDate(result.assessmentDate))
          dataset.data.push(result.competenceScore)
        }
        this.lineChartDataset.set([...this.lineChartDataset(), dataset])
        this.lineChartLabels.set(labels)

        console.log(this.lineChartLabels())
        console.log(this.lineChartDataset())

        this.modalService.open(`История - ${clickedLabel}`, this.lineChartModal()!)
      },
      error: err => {
        const errorMsg = err.error?.detail || "Ошибка получения результатов компетенции"
        this.toastService.error(errorMsg)
      }
    })
  }

  protected readonly getTypedMapEntries = getTypedMapEntries;
}
