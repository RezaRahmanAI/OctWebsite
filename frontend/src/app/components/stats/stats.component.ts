import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface Metric {
  label: string;
  value: string;
  detail: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [NgFor],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent {
  readonly metrics: Metric[] = [
    {
      label: 'Digital products delivered',
      value: '110+',
      detail: 'Websites, SaaS platforms, and mobile apps launched across Asia, Europe, and North America.'
    },
    {
      label: 'Learners accelerated',
      value: '35K',
      detail: 'Students and professionals who have completed ZeroProgramming pathways or corporate bootcamps.'
    },
    {
      label: 'Average go-live time',
      value: '8 weeks',
      detail: 'From product discovery to first release through ObjectCanvas agile delivery squads.'
    },
    {
      label: 'Talent-to-project pipeline',
      value: '92%',
      detail: 'Graduates who transition into paid projects or freelance engagements within 60 days.'
    }
  ];
}
