import {Component, computed, input, output} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ActiveElement, Chart, ChartConfiguration, ChartDataset, ChartEvent, ChartType} from 'chart.js';

@Component({
  selector: 'line-chart',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent {
  width = input("100%")
  height = input("500px")

  lineChartLabels = input.required<string[]>()
  lineChartDataset = input.required<ChartDataset<"line", (number | null)[]>[]>()

  lineChartData = computed(() => ({
    labels: this.lineChartLabels(),
    datasets: this.lineChartDataset(),
  }))
  lineChartOptions: ChartConfiguration['options'] = {
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
  };
  lineChartType: ChartType = 'line';
}
