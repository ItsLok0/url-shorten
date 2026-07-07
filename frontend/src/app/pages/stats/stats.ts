import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LinkService, Stats } from '../../services/link';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stats.html',
})
export class StatsComponent implements OnInit {
  stats: Stats | null = null;
  clicksByDayEntries: { date: string, count: number }[] = [];
  chart: Chart | null = null;

  @ViewChild('myChart') chartRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private linkService: LinkService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.linkService.getStats(id).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.clicksByDayEntries = Object.entries(stats.clicksByDay)
          .map(([date, count]) => ({ date, count }));
        this.cdr.detectChanges();
        setTimeout(() => {
          console.log('createChart appelé', this.chartRef)
          this.createChart();
        }, 100);
      },
      error: (err) => console.error(err)
    });
  }

  createChart() {
    if (!this.chartRef) {
      console.error('chartRef undefined')
      return;
    }

    const labels = this.clicksByDayEntries.map(e => e.date);
    const data = this.clicksByDayEntries.map(e => e.count);

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Clics par jour',
          data,
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }
}