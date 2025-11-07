import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface ProcessStep {
  title: string;
  description: string;
  outcomes: string[];
}

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [NgFor],
  templateUrl: './process.component.html',
  styleUrl: './process.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessComponent {
  readonly steps: ProcessStep[] = [
    {
      title: 'Strategy alignment',
      description: 'We align ObjectCanvas product strategists with ZeroProgramming mentors to define the transformation roadmap.',
      outcomes: ['Insight sessions with founders and functional leaders', 'Technical discovery + capability assessment', 'Learning objectives mapped to business OKRs']
    },
    {
      title: 'Co-creation sprints',
      description: 'Design, engineering, and academy labs run in parallel so that talent and product mature together.',
      outcomes: ['Design systems & prototypes validated with users', 'Feature squads ship in two-week cadences', 'Learners shadow delivery pods via mentorship hours']
    },
    {
      title: 'Enablement & growth',
      description: 'We transition knowledge with documentation, training, and analytics to sustain momentum beyond launch.',
      outcomes: ['Playbooks, SOPs, and automation handover', 'Corporate upskilling bootcamps & freelancing incubators', 'Post-launch growth experiments and CRO cycles']
    }
  ];
}
