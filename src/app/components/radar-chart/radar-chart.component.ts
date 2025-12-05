import {Component, computed, input, output} from '@angular/core';
import {ActiveElement, Chart, ChartConfiguration, ChartData, ChartDataset, ChartEvent, ChartType} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'radar-chart',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './radar-chart.component.html',
  styleUrl: './radar-chart.component.css',
})
export class RadarChartComponent {
  width = input("100%")
  height = input("768px")

  radarChartLabels = input.required<string[]>()
  radarChartDataset = input.required<ChartDataset<"radar", (number | null)[]>[]>()

  chartPointClicked = output<string>()

  radarChartData = computed(() => ({
    labels: this.radarChartLabels(),
    datasets: this.radarChartDataset(),
  }))
  radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 10,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          display: true,
          font: {
            size: 16
          },
          backdropColor: "#F1F1F6"
        },
        pointLabels: {
          font: {
            size: 16
          },
          color: '#1D1D1D'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          padding: 15,
          color: '#1D1D1D',
          font: {
            size: 16,
          },
        },
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 6,
        hoverRadius: 8
      }
    },
    onClick: (event: ChartEvent, elements: ActiveElement[], chart: Chart)=> {
      if (elements.length > 0) {
        const element = elements[0];
        const index = element.index;
        this.chartPointClicked.emit(chart.data.labels![index] as string);
      }
    },
  };
  radarChartType: ChartType = 'radar';
}
