import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type AcademyTrack = {
  title: string;
  description: string;
  modules: string[];
  outcomes: string[];
};

type LearningFormat = {
  label: string;
  detail: string;
};

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.css']
})
export class AcademyComponent {
  readonly overview = {
    eyebrow: 'Academy',
    title: 'Practitioner-led enablement',
    intro:
      'ObjectCanvas mentors and ZeroProgramming architects guide your teams through curated learning paths while delivering real products.'
  };

  readonly tracks: AcademyTrack[] = [
    {
      title: 'Product Leadership',
      description: 'Shape strategy, align stakeholders, and turn insight into delivery-ready roadmaps.',
      modules: ['Outcome-driven product framing', 'Service blueprinting & discovery rituals', 'Data-informed prioritisation'],
      outcomes: ['Confidence leading cross-functional teams', 'Clear storytelling for executives', 'Operating cadence tuned for growth']
    },
    {
      title: 'Modern Engineering',
      description: 'Adopt automation-first engineering practices with ZeroProgramming accelerators.',
      modules: ['Cloud-native architecture patterns', 'Automation pipelines & DevSecOps', 'Observability and SRE practices'],
      outcomes: ['Faster, safer releases', 'Shared standards and reusable assets', 'Telemetry-driven operations']
    },
    {
      title: 'Experience & Growth',
      description: 'Design end-to-end experiences and lifecycle programmes that convert and retain.',
      modules: ['Design systems & accessibility', 'Journey analytics & experimentation', 'Lifecycle automation toolkits'],
      outcomes: ['Consistent, inclusive interfaces', 'Customer journeys measured in real time', 'Growth programmes that scale responsibly']
    }
  ];

  readonly formats: LearningFormat[] = [
    {
      label: 'Embedded coaching',
      detail: 'Our mentors pair with your squads during active delivery to reinforce new capabilities.'
    },
    {
      label: 'Cohort programmes',
      detail: 'Six to eight week experiences with live sessions, labs, and peer collaboration.'
    },
    {
      label: 'Executive briefings',
      detail: 'Concise sessions that equip leaders to sponsor, measure, and sustain transformation.'
    }
  ];
}
