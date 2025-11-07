import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type ServiceStream = {
  title: string;
  description: string;
  focusAreas: string[];
  outcomes: string[];
};

type EngagementModel = {
  name: string;
  summary: string;
};

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  readonly overview = {
    eyebrow: 'Services',
    title: 'Strategy, engineering, and enablement in one motion',
    intro:
      'ObjectCanvas leads discovery and design, while ZeroProgramming automates the path to production. Together we build enduring digital ecosystems.'
  };

  readonly serviceStreams: ServiceStream[] = [
    {
      title: 'Strategy & Experience',
      description:
        'Frame the ambition, align stakeholders, and choreograph experiences that people trust.',
      focusAreas: ['Product and service vision sprints', 'Customer & employee journey orchestration', 'Roadmaps tied to measurable OKRs'],
      outcomes: ['Validated product direction', 'Stakeholder confidence', 'Prioritised delivery backlog']
    },
    {
      title: 'Engineering & Platforms',
      description:
        'ZeroProgramming engineers bring modular architecture, data fabrics, and automation toolkits.',
      focusAreas: ['Composable service blueprints', 'Integration accelerators & data mesh patterns', 'Cloud-native delivery with observability'],
      outcomes: ['Faster releases with less risk', 'Secure, scalable foundations', 'Operational insight across teams']
    },
    {
      title: 'Growth & Lifecycle',
      description: 'Activate your launch with integrated marketing, analytics, and lifecycle automation.',
      focusAreas: ['Launch playbooks & funnel design', 'Campaign execution across channels', 'Embedded analytics & experimentation'],
      outcomes: ['Momentum on day one', 'Clear ROI on every initiative', 'Continuous optimisation feedback loops']
    },
    {
      title: 'Enablement & Change',
      description:
        'ObjectCanvas coaches make sure your people can sustain delivery long after the engagement ends.',
      focusAreas: ['On-the-job mentoring & pair programming', 'Academy learning paths for each role', 'Governance and capability playbooks'],
      outcomes: ['Teams confident in new tooling', 'Shared rituals that stick', 'A culture of continuous improvement']
    }
  ];

  readonly engagementModels: EngagementModel[] = [
    {
      name: 'Integrated product squads',
      summary:
        'Cross-functional pods embed with your product leaders to deliver outcomes across discovery, design, and build.'
    },
    {
      name: 'Platform accelerators',
      summary:
        'Bring the ZeroProgramming automation stack into your environment with tailored governance and security patterns.'
    },
    {
      name: 'Capability sprints',
      summary:
        'Rapid enablement bursts focused on levelling-up design systems, automation, or modern engineering practices.'
    }
  ];
}
